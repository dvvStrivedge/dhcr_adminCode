import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeletePickupLocationMutation } from '@/data/pickupLocation';
import { useDeleteTagMutation } from '@/data/tag';
import { getErrorMessage } from '@/utils/form-error';

const PickupLocationDeleteView = () => {
  const { mutate: deleteTagById, isLoading: loading } = useDeletePickupLocationMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    try {
      deleteTagById({ id: data });
      closeModal();
    } catch (error) {
      closeModal();
      getErrorMessage(error);
    }
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default PickupLocationDeleteView;
