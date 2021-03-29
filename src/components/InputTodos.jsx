import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

// Add material UI core/icons
import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    Button,
    makeStyles,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    Paper,
    TableCell,
    withStyles,
    Modal,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

// Database
import database from '../utils/firebase';

//Material UI CSS style rules
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1.5),
    },
    formControl: {
        margin: theme.spacing(2),
    },
    table: {
        minWidth: 100,
    },
    icons: {
        padding: theme.spacing(0.5),
    },
    paper: {
        position: 'absolute',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        padding: theme.spacing(2, 4, 3),
        margin: theme.spacing('auto'),
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

//--- Material UI Styled rules end here ---//

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

// The Exported Function
const InputTodo = () => {
    const classes = useStyles();

    const [todos, setTodos] = useState([]);
    const [name, setName] = useState('');
    const [listTodo, setListTodo] = useState('');
    // Database listener from Firebase
    useEffect(() => {
        database.collection('todos').onSnapshot((snap) => {
            setTodos(snap.docs.map((doc) => doc.data().todoListing));
        });
    }, []);

    const AddTodo = (e) => {
        e.preventDefault();
        database.collection('todos').add({
            todoListing: {
                name,
                listTodo,
            },
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setName('');
        setListTodo('');
    };

    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2>Text in a modal</h2>
            <p>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
        </div>
    );
    return (
        <React.Fragment>
            <form action='' className='input__todo'>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor='my-input'>✅️ Name</InputLabel>
                    <Input
                        value={name}
                        name={name}
                        onChange={(e) => setName(e.target.value)}
                        type='text'
                        aria-describedby='my-helper-text'
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor='my-input'>📝️ ToDo</InputLabel>
                    <Input
                        value={listTodo}
                        onChange={(e) => setListTodo(e.target.value)}
                        aria-describedby='my-helper-text'
                    />
                    <FormHelperText id='my-helper-text'>
                        Add your todo list
                    </FormHelperText>
                </FormControl>
                <Button
                    variant='contained'
                    color='primary'
                    size='medium'
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    disabled={!(name && listTodo)}
                    type='submit'
                    onClick={AddTodo}
                >
                    Add
                </Button>
            </form>
            <div className='list__todo'>
                <TableContainer component={Paper} aria-label='customized table'>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='center'>
                                    🎯️ Name
                                </StyledTableCell>
                                <StyledTableCell align='center'>
                                    📝️ Todo
                                </StyledTableCell>
                                <StyledTableCell align='center'>
                                    🖋️&nbsp; &nbsp;❌️
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Get all the Todo data from InputTodo */}

                            {todos.map((list, i) => {
                                return (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell
                                            align='center'
                                            component='th'
                                            scope='row'
                                        >
                                            {list.name}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {list.listTodo}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <EditIcon
                                                onClick={handleOpen}
                                                className={classes.icons}
                                            />
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby='simple-modal-title'
                                                aria-describedby='simple-modal-description'
                                            >
                                                {body}
                                            </Modal>
                                            <DeleteForeverIcon
                                                onClick={(e) =>
                                                    database
                                                        .collection('todos')
                                                        .doc(list.id)
                                                        .delete()
                                                }
                                                className={classes.icons}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </React.Fragment>
    );
};

export default InputTodo;
