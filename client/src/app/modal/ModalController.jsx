import { closeModal } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import LogoutModal from "./LogOutModal";
import ModalBase from "./ModalBase";

import PreviewModal from "./blog/PreviewModal";

const ModalController = () => {
  const { modalType, modalProps } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  const renderModal = () => {
    return modalType === "logout" ? (
      <LogoutModal closeModal={closeModalHandler} {...modalProps} />
    ) : modalType === "preview" ? (
      <PreviewModal closeModal={closeModalHandler} {...modalProps} />
    ) : null;
  };

  return (
    modalType && (
      <ModalBase isOpen={true} onClose={closeModalHandler}>
        {renderModal()}
      </ModalBase>
    )
  );
};

export default ModalController;
