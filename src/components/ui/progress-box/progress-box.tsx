import { CheckMark } from '@/components/icons/checkmark';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import styles from './progress-box.module.css';

type ProgressProps = {
  data: any[] | undefined;
  status: string;
  filledIndex: number;
};

const ProgressBox: React.FC<ProgressProps> = ({
  status,
  data,
  filledIndex,
}) => {

  return (
    <Scrollbar
      className="h-full w-full"
      options={{
        scrollbars: {
          autoHide: 'never',
        },
      }}
    >
      <div className="flex w-full flex-col py-7 md:flex-row md:items-start md:justify-center">
        {data?.map((item: any, index) => (
          <div className={styles.progress_container} key={`order-status-${index}`}>
            <div
              className={cn(
                'relative pt-2 pb-2 flex items-center justify-center md:w-full md:mb-4',
                index <= filledIndex ? `${styles.checked} bg-${item.color}` : ''
              )}
            >
              <div className={`text-sm font-bold text-accent w-9 h-9 flex items-center justify-center rounded-full bg-light border border-dashed z-10 bg-${item.color}`} style={{ color: '#fff', }}>
                {index <= filledIndex ? (
                  <div className="h-4 w-3">
                    <CheckMark className="w-full" />
                  </div>
                ) : (
                  item?.serial
                )}
              </div>
              <div className={`bg - ${item.color}`} />
            </div>

            <div className="flex flex-col items-start ltr:ml-5 rtl:mr-5 md:items-center ltr:md:ml-0 rtl:md:mr-0">
              {item && (
                <span className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center">
                  {item?.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Scrollbar>
  );
};

export default ProgressBox;