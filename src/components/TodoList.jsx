import React, { useState } from 'react';
import database from '../utils/firebase';

// Add Material UI Core/Icons
import {
    TableRow,
    TableCell,
    Input,
    InputLabel,
    withStyles,
    Modal,
    Button,
    FormHelperText,
    makeStyles,
    IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

//Functions
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        padding: theme.spacing(2, 4, 3),
        margin: theme.spacing(2, 2, 1),
    },
    icons: {
        padding: theme.spacing(0.8),
    },
    edit: {
        padding: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(2),
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 600,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function rand() {
    return Math.round(Math.random() * 10) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const TodoList = (props) => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [listTodo, setListTodo] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateTodo = (e) => {
        e.preventDefault();
        database.collection('todos').doc(props.id).set(
            {
                todoListing: { listTodo },
            },
            { merge: true }
        );
        setListTodo('');
        setOpen(false);
    };

    const body = (
        <form style={modalStyle} className={classes.paper}>
            <InputLabel htmlFor='name'>{props.name}</InputLabel>
            <Input
                value={listTodo}
                className={classes.edit}
                placeholder={props.listTodo}
                onChange={(e) => setListTodo(e.target.value)}
            />
            <FormHelperText>🖊️ Update your todo</FormHelperText>
            <Button
                variant='contained'
                color='primary'
                size='medium'
                className={classes.button}
                startIcon={<SaveIcon />}
                disabled={!listTodo}
                type='submit'
                onClick={updateTodo}
            >
                Save
            </Button>
        </form>
    );
    return (
        <StyledTableRow>
            <StyledTableCell align='center' component='th' scope='row'>
                {props.name}
            </StyledTableCell>
            <StyledTableCell align='center'>{props.listTodo}</StyledTableCell>
            <StyledTableCell align='center'>
                <IconButton onClick={handleOpen} className={classes.icons}>
                    <EditIcon />
                </IconButton>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='simple-modal-title'
                    aria-describedby='simple-modal-description'
                >
                    {body}
                </Modal>
                <IconButton
                    className={classes.icons}
                    onClick={() =>
                        database.collection('todos').doc(props.id).delete()
                    }
                >
                    <DeleteForeverIcon />
                </IconButton>
            </StyledTableCell>
        </StyledTableRow>
    );
};

export default TodoList;
