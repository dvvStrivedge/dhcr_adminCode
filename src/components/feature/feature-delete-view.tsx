import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteFeatureMutation } from '@/data/feature';
import { getErrorMessage } from '@/utils/form-error';

const FeatureDeleteView = () => {
  const { mutate: deleteFeatureById, isLoading: loading } = useDeleteFeatureMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    try {
      deleteFeatureById({ id: data });
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

export default FeatureDeleteView;
