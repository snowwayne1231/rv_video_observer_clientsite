import { configureStore } from '@reduxjs/toolkit'
// import videoReducer from './reducers/videos'
import videoFrameReducer, { buildVideoConstruct, refreshVideos, beforeReloadVideo } from './reducers/videoSlice';
import mainReducer, { refreshHistory, addHistroyByVideos } from './reducers/mainSlice';
// import { applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import io from 'socket.io-client';



// export const hostAddress: string = '127.0.0.1:5000';
export const hostAddress: string = '';

// const socket = io(hostAddress, {secure:false});
// const socket = io(hostAddress, { transports : ['websocket'], secure:false });
const socket = io(hostAddress);

socket.on('connect', function() {
  socket.emit('message', 'getinfo');
  console.log('connected');
});

socket.on('video_info', function(info) {
  console.log('video_info: ', info)
  store.dispatch(buildVideoConstruct(info))
});

socket.on('video_data_update', function(data) {
  console.log('video_data_update: ', data)
  store.dispatch(refreshVideos(data))
  store.dispatch(addHistroyByVideos(data))
});

socket.on('history_update', function(data) {
  store.dispatch(refreshHistory(data))
});


// const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const store = configureStore({
  reducer: {
    video: videoFrameReducer,
    main: mainReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware.withExtraArgument(socket)),
})

export const reloadVideos = function() {
  store.dispatch(beforeReloadVideo());
  socket.emit('message', 'reload');
}


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store