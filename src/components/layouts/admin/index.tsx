import Navbar from '@/components/layouts/navigation/top-navbar';
import { Fragment, useEffect, useState } from 'react';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { useRouter } from 'next/router';
import { getMessaging, getToken } from '@firebase/messaging';
import app from '@/utils/firebase';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  const [token, setToken] = useState('');
  const [notificationPermission, setNotificationPermission] =
    useState('default');

  const SidebarItemMap = () => (

    <Fragment>
      {siteSettings.sidebarLinks.admin.map(({ href, label, icon }) => (
        <SidebarItem href={href} label={t(label)} icon={icon} key={href} />
      ))}
    </Fragment>
  );

  useEffect(() => {
    if ('Notification' in window) {
      // Check if the browser supports the Notification API
      if (Notification.permission !== 'granted') {
        // If permission is not granted, request permission
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            // Now you can send push notifications
          } else {
            console.log('Notification permission denied.');
          }
        });
      }
    }
    // const handleRequestPermission = async () => {
    //   if ('Notification' in window) {
    //     if (Notification.permission !== 'granted') {
    //       try {
    //         await Notification.requestPermission().then((permission) => {
    //           if (permission === 'granted') {
    //             console.log('Notification permission granted.');
    //             // Now you can send push notifications
    //           }
    //         }
    //         );
    //       } catch (error) {
    //         console.error('Error requesting permission:', error);
    //       }
    //     }
    //   }
    // };

    // handleRequestPermission();

    const messaging = getMessaging(app);

    const requestNotificationPermission = async () => {
      try {
        console.log('requestNotificationPermission', typeof window);

        const permission = await Notification.requestPermission();
        const newToken = await getToken(messaging);
        // set token in local storage
        localStorage.setItem('fcm_token', newToken);
        // setNotificationPermission(permission);
        // setToken(newToken);
      } catch (error) {
        console.error('Notification permission denied:', error);
      }
    };
    requestNotificationPermission();
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <SidebarItemMap />
      </MobileNavigation>

      <div className="flex flex-1 pt-20">
        <aside className="xl:w-76 fixed bottom-0 hidden h-full w-72 overflow-y-auto bg-white px-4 pt-22 shadow ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block">
          <div className="flex flex-col space-y-6 py-3">
            <SidebarItemMap />
          </div>
        </aside>
        <main className="ltr:xl:pl-76 rtl:xl:pr-76 w-full ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0">
          <div className="h-full p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
