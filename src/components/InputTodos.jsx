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
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

// Database
import database from '../utils/firebase';
import TodoList from './TodoList';

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

//--- Material UI Styled rules end here ---//

// The Exported Function
const InputTodo = () => {
    const classes = useStyles();

    const [todos, setTodos] = useState([]);
    const [name, setName] = useState('');
    const [listTodo, setListTodo] = useState('');
    // Database listener from Firebase
    useEffect(() => {
        database
            .collection('todos')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snap) => {
                setTodos(
                    snap.docs.map((doc) => ({
                        id: doc.id,
                        lists: doc.data().todoListing,
                    }))
                );
            });
    }, []);

    // Database addition
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

    return (
        <React.Fragment>
            <form action='' className='input__todo'>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor='name'>✅️ Name</InputLabel>
                    <Input
                        value={name}
                        name={name}
                        onChange={(e) => setName(e.target.value)}
                        type='text'
                        aria-describedby='my-helper-text'
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor='todo'>📝️ ToDo</InputLabel>
                    <Input
                        value={listTodo}
                        onChange={(e) => setListTodo(e.target.value)}
                    />
                    <FormHelperText>Add your todo list</FormHelperText>
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
                                    🖊️&nbsp; &nbsp;❌️
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Get all the Todo data from InputTodo */}

                            {todos.map((list, i) => {
                                return (
                                    <TodoList
                                        key={i}
                                        name={list.lists.name}
                                        listTodo={list.lists.listTodo}
                                        id={list.id}
                                    />
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
