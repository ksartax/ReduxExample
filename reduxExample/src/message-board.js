import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';

import { get } from './http/index';

const UPDATE_STATUS = 'UPDATE_STATUS';
const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';
const NEW_MESSAGE_SERVER_ACCEPTED = `NEW_MESSAGE_SERVER_ACCEPTED`;

const READY = `READY`;
const WAITING = `WAITING`;
const ONLINE = 'ONLINE';
const OFFLINE = 'OFFLINE';

const defaultState = {
    messages: [
        {
            date: new Date('2016-10-10 10:11:55'),
            postedBy: 'Stan',
            content: 'Test 1'
        },
        {
            date: new Date('2016-10-10 10:11:55'),
            postedBy: 'Stan',
            content: 'Test 2'
        },
        {
            date: new Date('2016-10-10 10:11:55'),
            postedBy: 'Stan',
            content: 'Test 3'
        },
        {
            date: new Date('2016-10-10 10:11:55'),
            postedBy: 'Stan',
            content: 'Test 4'
        }
    ],
    userStatus: 'Online',
    apiCommunicationStatus: READY
}

const apiCommunicationStatusReducer = (state = defaultState.apiCommunicationStatus, {type}) => {
    switch (type) {
        case CREATE_NEW_MESSAGE:
            return WAITING;
        case NEW_MESSAGE_SERVER_ACCEPTED:
            return READY;
    }
    return state;
}

const reducerUserStatus = (state = defaultState.userStatus, action) => {
    switch (action.type) {
        case UPDATE_STATUS:
            return action.value; 
        break;
    }

    return state;
}

const reducerMessages = (state = defaultState.messages, action) => {
    switch (action.type) {
        case CREATE_NEW_MESSAGE:
            return [ {date: action.date, postedBy: action.postedBy, content: action.content}, ...state ]; 
        break;
    }

    return state;
}

const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
}

const newMessageAction = (content, postedBy) => {
    let date = new Date();

    get('/api/create', ( id => {
        store.dispatch({
            type: NEW_MESSAGE_SERVER_ACCEPTED
        })
    }));

    return {
        type: CREATE_NEW_MESSAGE,
        content,
        date,
        postedBy
    }
}

const store = createStore(combineReducers({
    messages: reducerMessages,
    userStatus: reducerUserStatus,
    apiCommunicationStatus: apiCommunicationStatusReducer
}), applyMiddleware(logger));

document.forms.selectStatus.status.addEventListener("change", (e) => {
    store.dispatch(statusUpdateAction(e.target.value));
});

document.forms.newMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage[`preferences`] ? JSON.parse(localStorage[`preferences`]).userName : "Jim";
    store.dispatch(newMessageAction(value, username));
});

const render = () => {
    const { messages, userStatus, apiCommunicationStatus } = store.getState();
    document.getElementById('messages').innerHTML = messages
        .sort((a, b) => b.date - a.date)
        .map(message => 
            `<div> 
                ${message.postedBy} : ${message.content}
            </dev>`
        )
        .join("");

    document.forms.newMessage.newMessage.value = "";
    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE || apiCommunicationStatus === WAITING);    
}
render();

store.subscribe(render);