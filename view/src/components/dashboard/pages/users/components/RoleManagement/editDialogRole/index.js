import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditForm from './editForm';

export default function EditDialogRole(props) {
    const [open, setOpen] = React.useState(false);
    let rowData = props.rowData;

    const handleClose = () => {
        props.handleClose()
    };

    useEffect(() => {
        setOpen(props.open)
        //console.log(rowData)
    })


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                fullWidth={true}
                maxWidth={"lg"}
            >
                <DialogContent>
                    <EditForm rowData={rowData} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}