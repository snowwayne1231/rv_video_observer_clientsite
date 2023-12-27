import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, hostAddress } from '../index';



export enum vStatus {
  OPEN = 1,
  CLOSE = 0,
  LOADING = 3,
  FAILED = 4,
}

export interface VideoState {
  id: string,
  status: vStatus,
  img: string,
  minute: number,
  minuteLast: number,
  ontime: boolean,
  wrongs: any,
  warning: any,
  parsedDigits: string[],
  timestamp: number,
}

export interface VideoFrameState {
  session: string;
  list: VideoState[];
  ready: boolean;
  mapListIndex: any;
}

const initialState: VideoFrameState = {
  session: '',
  list: [],
  ready: false,
  mapListIndex: {},
};

const getSortValue = function(vst: vStatus) {
  switch (vst) {
    case vStatus.OPEN:
    case vStatus.LOADING: return 3;
    case vStatus.CLOSE: return 2;
    case vStatus.FAILED: return 1;
    default:
  }
  return 0
}

const sortVideoArray = function(a:VideoState, b:VideoState) {
  const gapVal = getSortValue(b.status) - getSortValue(a.status)
  return gapVal === 0 ? (b.id > a.id ? -1 : 1) : gapVal;
}

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    refreshVideos: (state, action: PayloadAction<VideoState[]>) => {
      // console.log('refreshVideos action: ', action)
      const payload = action.payload;
      if (state.ready && payload) {
        const nextList = state.list.slice();
        const mapListIndex:any = {}
        payload.forEach((e:any) => {
          const listIndex = state.mapListIndex[e.id]
          if (listIndex >= 0) {
            nextList[listIndex] = {
              ...nextList[listIndex],
              minute: e['minute_flexible'],
              minuteLast: e['minute_last'],
              ontime: e.ontime,
              status: e.flag as vStatus,
              wrongs: e.wrongs,
              warning: e.warning,
              parsedDigits: e['parsed_digits'],
              timestamp: new Date(e['last_timestamp']).getTime(),
            }
          }
        })
        nextList.sort(sortVideoArray);
        nextList.forEach((e: any, idx: number) => {
          mapListIndex[e.id] = idx
        })
        state.mapListIndex = mapListIndex
        state.list = nextList;
      }
      
      // state.list = action.payload.slice();
    },
    buildVideoConstruct: (state, action: PayloadAction<VideoState[]>) => {
      console.log('buildVideoConstruct action: ', action)
      const mapListIndex:any = {}
      const nextList = action.payload.map((e: any) => {
        const resVs:VideoState = {
          id: e.id,
          status: e.flag === vStatus.OPEN ? vStatus.LOADING : e.flag,
          img: hostAddress ? 'http://' + hostAddress + e.img : e.img,
          ontime: true,
          minute: -1,
          minuteLast: -1,
          wrongs: e.wrongs,
          warning: e.warning,
          parsedDigits: [],
          timestamp: new Date().getTime(),
        }
        return resVs
      })
      nextList.sort(sortVideoArray)
      nextList.forEach((e: any, idx: number) => {
        mapListIndex[e.id] = idx
      })
      state.list = nextList
      state.mapListIndex = mapListIndex
      state.ready = true
    },
    beforeReloadVideo: (state) => {
      state.list = [];
      state.mapListIndex = {};
      state.ready = false;
    }
  },
  
});

export const { refreshVideos, buildVideoConstruct, beforeReloadVideo } = videoSlice.actions;

export const videos = (state: RootState) => state.video.list;
export const videoBasicInfo = (state: RootState) => state.video;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.videos.value;


export default videoSlice.reducer;
