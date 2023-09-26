import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteIncludeMutation } from '@/data/include';
import { getErrorMessage } from '@/utils/form-error';

const TagDeleteView = () => {
  const { mutate: deleteIncludeById, isLoading: loading } = useDeleteIncludeMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    try {
      deleteIncludeById({ id: data });
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

export default TagDeleteView;
