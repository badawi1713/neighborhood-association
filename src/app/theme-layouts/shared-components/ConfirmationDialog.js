import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';

function ConfirmationDialog({
  open,
  title,
  content,
  cancelActionHandler,
  confirmActionHandler,
  loading,
  loadingText,
  confirmActionText,
  cancelActionText,
  disabled,
  type,
  confirmButtonType,
}) {
  return (
    <Dialog
      open={open}
      aria-labelledby="custom-dialog-title"
      classes={{
        paper: 'rounded-8',
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText color="textSecondary" className="font-500">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={cancelActionHandler}>
          {cancelActionText}
        </Button>
        <Button
          type={confirmButtonType}
          variant="contained"
          disabled={loading || disabled}
          onClick={confirmActionHandler}
          color={type}
          autoFocus
        >
          {loading ? loadingText : confirmActionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  cancelActionHandler: PropTypes.func,
  confirmActionHandler: PropTypes.func,
  cancelActionText: PropTypes.string,
  confirmActionText: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  type: PropTypes.string,
  onClose: PropTypes.bool,
  disabled: PropTypes.bool,
  confirmButtonType: PropTypes.string,
};

ConfirmationDialog.defaultProps = {
  disabled: false,
  open: false,
  title: 'Judul dialog',
  content: 'This is dialog content to explain everything whats the meaning of this dialog shown!',
  cancelActionHandler: null,
  confirmActionHandler: null,
  cancelActionText: 'Batal',
  confirmActionText: 'Ok',
  loading: false,
  loadingText: 'Loading',
  type: 'primary',
  onClose: false,
  confirmButtonType: 'button',
};

export default ConfirmationDialog;
