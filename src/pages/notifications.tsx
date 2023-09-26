// notification page
// Compare this snippet from src\pages\notifications.tsx:
import { Fragment, useEffect, useState } from 'react';
import { MappedPaginatorInfo, NextPageWithLayout } from '@/types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Column } from 'rc-table';
import Layout from '@/components/layouts/admin';
import { useNotificationsQuery, useUpdateNotificationMutation } from '@/data/notification';
import Pagination from '@/components/ui/pagination';
import Card from '@/components/common/card';
import { useTranslation } from 'react-i18next';
import { useMeQuery } from '@/data/user';
import { siteSettings } from '@/settings/site.settings';
import Search from '@/components/common/search';
import { useMutation } from 'react-query';
import { notificationClient } from '@/data/client/notification';
import Avatar from 'react-avatar';

type IProps = {
    paginatorInfo: MappedPaginatorInfo | null;
    onPagination: (current: number) => void;
}
const Notifications = () => {
    const { t } = useTranslation();
    const [token, setToken] = useState('');
    const [notificationPermission, setNotificationPermission] =
        useState('default');
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data } = useMeQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState<any>([]);
    const [loadFirst, setLoadFirst] = useState(true);

    // get notification list
    const { mutate: getNotifications } = useMutation(notificationClient.all, {
        onSuccess: (data: any) => {
            setNotifications(data?.data);
        },
    });

    // update notification status to read
    const { mutate: updateNotification, isLoading: updating } = useUpdateNotificationMutation();

    function onPagination(current: any) {
        setPage(current);
        setLoadFirst(true);
    }

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


    function handleSearch({ searchText }: { searchText: string }) {
        setSearchTerm(searchText);
        setPage(1);
        setLoadFirst(true);
    }

    useEffect(() => {
        // get notification list
        if (loadFirst) {
            getNotifications({
                page,
                limit: 10,
                search: searchTerm,
            });
            setLoadFirst(false);
        }
    }, [page, loadFirst, searchTerm]);

    return (
        // notification listing
        <div className="">
            <Card className="mb-8 flex flex-col">
                <div className="flex w-full flex-col items-center md:flex-row">
                    <div className="mb-4 md:mb-0 md:w-1/4">
                        <h1 className="text-lg font-semibold text-heading">
                            {t('form:input-label-notifications')}
                        </h1>
                    </div>
                    <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
                        <Search onSearch={handleSearch} />
                    </div>
                </div>
            </Card>
            <ul
                className=""
            // style={{ right: '-50px' }}
            >
                {notifications?.data?.length === 0 && (
                    <div className="d-flex justify-content-center align-items-center">
                        <p className="text-muted">No notifications found</p>
                    </div>
                )}
                {notifications?.data?.length && notifications?.data?.map((notification: any) => (
                    <li key={notification?.id}>
                        <div
                            className={`d-flex border-bottom mb-1 flex-row ${notification?.is_read ? 'read' : 'unread'
                                }`}
                            key={`${notification?.id}_notification`}
                            style={{ borderBottom: '1px solid #ccc' }}
                            onClick={() => onNotificationClick(notification)}
                        >
                            <div
                                className="flex items-center pt-2 pl-3 pr-2"
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
                    </li>
                ))}
            </ul>
            {
                !!notifications?.total && (
                    <div className="flex items-center justify-end">
                        <Pagination
                            total={notifications?.total}
                            current={notifications?.current_page}
                            pageSize={notifications?.per_page}
                            onChange={(page) => onPagination(page)}
                        />
                    </div>
                )
            }
        </div >
    );
};

Notifications.Layout = Layout;


export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
    },
});

export default Notifications;
