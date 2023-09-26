import Logo from '@/components/ui/logo';
import { useUI } from '@/contexts/ui.context';
import AuthorizedMenu from './authorized-menu';
import LinkButton from '@/components/ui/link-button';
import { NavbarIcon } from '@/components/icons/navbar-icon';
import { color, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import {
  adminAndOwnerOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import LanguageSwitcher from './language-switer';
import { Config } from '@/config';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { NotificationIcon } from '@/components/icons/notification-icon';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { notificationClient } from '@/data/client/notification';
import { useMeQuery } from '@/data/user';
import Avatar from 'react-avatar';

const Navbar = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useUI();

  const { permissions } = getAuthCredentials();

  const { enableMultiLang } = Config;

  const { openModal } = useModalAction();
  const [notifications, setNotifications] = useState<any>([]);
  const [unreadCount, setUnreadCount] = useState<any>(0);

  // get notification list
  const { mutate: getNotifications } = useMutation(notificationClient.all, {
    onSuccess: (data: any) => {
      setUnreadCount(data?.un_read_count);
      setNotifications(data.data);
    },
  });
  const router = useRouter();
  const { data } = useMeQuery();

  // update notification status to read
  const { mutate: updateNotification, isLoading: updating } = useMutation(
    notificationClient.update,
    {
      onSuccess: (data: any) => {
        getNotifications({
          limit: 5,
          language: router.locale as string,
        });
      },
    }
  );

  const convertDate = (date: string) => {
    // convert date to days ago, hours ago, minutes ago format
    const currentDate = new Date();
    const previousDate = new Date(date);
    const diff = currentDate.getTime() - previousDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  }

  const onNotificationClick = (notification: any) => {
    // update notification status to read
    updateNotification(
      notification?.id,
    );
    // redirect to order detail page
    router.push(`/orders/${notification?.order?.id}`);
  }

  // get notification list
  useEffect(() => {
    // call notification api every 5 seconds
    // const interval = setInterval(() => {
    getNotifications({
      limit: 5,
      language: router.locale as string,
    });
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);


  return (
    <header className="fixed z-40 w-full bg-white shadow">
      <nav className="flex items-center justify-between px-5 py-4 md:px-8">
        {/* <!-- Mobile menu button --> */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none lg:hidden"
        >
          <NavbarIcon />
        </motion.button>

        <div className="ms-5 me-auto hidden md:flex">
          <Logo />
        </div>

        <div className="space-s-8 flex items-center">
          {/* {hasAccess(adminAndOwnerOnly, permissions) && (
            <LinkButton
              href={Routes.shop.create}
              className="ms-4 md:ms-6"
              size="small"
            >
              {t('common:text-create-shop')}
            </LinkButton>
          )} */}
          {enableMultiLang ? <LanguageSwitcher /> : null}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center focus:outline-none">
              <span className="relative flex items-center">
                <NotificationIcon className="h-5 w-5" />
                <span className="absolute -top-3 -right-2.5 flex min-h-[20px] min-w-[20px] shrink-0 items-center justify-center rounded-full border-2 border-light-100 bg-light px-0.5 text-10px font-bold leading-none text-dark dark:border-dark-250">
                  {unreadCount}
                </span>
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                as="ul"
                className="end-0 origin-top-end notification absolute mt-1 w-56 rounded bg-light shadow-2xl focus:outline-none"
                style={{
                  right: '-50px',
                  width: '480px',
                  overflowY: 'auto',
                  height: '480px',
                }}
              >
                {notifications?.data?.length ? (
                  <>
                    {notifications?.data?.map((notification: any) => (
                      <>
                        <Menu.Item key={notification?.id}>
                          <div
                            className={`transition-fill-colors d-flex border-bottom mb-1 flex-row ${notification?.is_read ? 'read' : 'unread'
                              }`}
                            key={`${notification?.id}_notification`}
                            onClick={() => onNotificationClick(notification)}
                          >
                            <div
                              className="mb-2 flex items-center pt-2 pl-3 pr-2"
                              style={{ cursor: 'pointer', padding: '5px' }}
                            >
                              <span
                                className="flex items-center justify-center"
                                style={{
                                  borderRadius: '50px',
                                  // border: '1px solid #ccc',
                                  width: '40px',
                                  height: '40px',
                                  minWidth: '40px',
                                  minHeight: '40px',
                                }}
                              >
                                <Avatar
                                  size="32"
                                  round={true}
                                  name={notification?.order?.customer?.name}
                                  textSizeRatio={2}
                                  src={notification?.order?.customer?.avatar?.thumbnail}
                                />
                              </span>

                              <span
                                className="font-weight-medium notification-heading mb-1 grow pl-2"
                                style={{ fontSize: '16px' }}
                              >
                                <b>{notification?.title}</b>
                              </span>
                              {!notification?.is_read ? (
                                <span className="hightlight"></span>
                              ) : ''}
                            </div>
                            <div
                              className="pl-3 pr-2"
                              style={{
                                borderBottom: '1px solid #252525',
                                paddingLeft: '50px',
                              }}
                            >
                              <div style={{ cursor: 'pointer' }}>
                                {/* <p className="font-weight-medium mb-1">test 1</p> */}
                                <p
                                  className="text-muted text-small notification-text1 mb-1"
                                  style={{
                                    fontSize: '13px',
                                    lineHeight: 'normal',
                                  }}
                                >
                                  {notification?.description}
                                </p>
                                <p
                                  className="text-muted text-small mb-3 mb-3"
                                  style={{
                                    fontSize: '10px',
                                    lineHeight: 'normal',
                                    marginBottom: '15px',
                                  }}
                                >
                                  {convertDate(notification?.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Menu.Item>
                      </>
                    ))}
                    <Menu.Item key="1">
                      {/* show all notification button  */}
                      <div className="d-flex justify-content-between flex-row">
                        <div className="pl-3 pr-2">
                          <div style={{ cursor: 'pointer' }}>
                            <p
                              className="text-muted text-small mb-3 mt-3 text-center"
                              style={{
                                fontSize: '10px',
                                lineHeight: 'normal',
                                marginBottom: '15px',
                              }}
                              onClick={() => router.push(Routes.notification)}
                            >
                              Show all notifications
                            </p>
                          </div>
                        </div>
                      </div>
                    </Menu.Item>
                  </>
                ) : (
                  <Menu.Item key="1">
                    {/* show all notification button  */}
                    <div className="d-flex justify-content-between flex-row">
                      <div className="pl-3 pr-2">
                        <div style={{ cursor: 'pointer' }}>
                          <p
                            className="text-muted text-small mb-3 mt-3 text-center"
                            style={{
                              fontSize: '16px',
                              lineHeight: 'normal',
                              marginBottom: '15px',
                            }}
                          >
                            No notification found
                          </p>
                        </div>
                      </div>
                    </div>
                  </Menu.Item>
                )}
              </Menu.Items>
            </Transition>
          </Menu>
          {/* <span className="count">2</span> */}
          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
