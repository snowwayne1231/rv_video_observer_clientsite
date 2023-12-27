import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { warn } from 'console';
// import { VideoState } from './videoSlice';


export enum WarningKey {
  DATETIME = 'datetime',
  FORMAT = 'format',
  OVERTIME = 'overtime',
  OTHER = 'other',
}

export interface HistoryWarning {
  id: string,
  key: WarningKey,
  flexible: number,
  digits: string[],
  time: number,
}

export interface MainState {
  session: string;
  status: string;
  history: HistoryWarning[];
}

const initialState: MainState = {
  session: '',
  status: '',
  history: [],
};


export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    refreshHistory: (state, action: PayloadAction<HistoryWarning[]>) => {
      // console.log('refreshHistory action: ', action)
      const payload = action.payload;  
      state.history = payload;
    },
    addHistroyByVideos: (state, action: PayloadAction<any[]>) => {
      // console.log('addHistroy action: ', action)
      const payload = action.payload;
      const newWarnings : HistoryWarning[] = [];
      
      payload.forEach((val:any) => {
        Object.keys(val.warning).forEach(key => {
          if (val.warning[key]) {
            // console.log('val: ', val);
            const newHistory : HistoryWarning = {
              id: val.id,
              key: key as WarningKey,
              flexible: val['minute_flexible'],
              digits: val['parsed_digits'],
              time: val['last_timestamp'],
            }
            newWarnings.push(newHistory);
          }
        })
      })

      if (newWarnings.length > 0) {
        const sliceBegin = Math.max(0, state.history.length + newWarnings.length - 50);
        const nextHistories = state.history.slice(sliceBegin);
        state.history = nextHistories.concat(newWarnings);

        newWarnings.forEach((warning: HistoryWarning) => {
          const options: NotificationOptions = {
            body: '',
            dir: 'ltr',
          }
          switch (warning.key) {
            case WarningKey.DATETIME: options.body = `[ ${warning.id} ] 無法捕捉到平板資訊.`; break;
            case WarningKey.OVERTIME: options.body = `[ ${warning.id} ] 連續偵測到時間可能延遲.`; break;
            // case WarningKey.FORMAT: options.body = `[ ${warning.id} ] 連續偵測到格式錯誤.`; break;
            default: return;
          }
          const notification = new Notification('Warning of Videos Observer ', options);
        });
      }

      return state
    }
  },
});

export const { refreshHistory, addHistroyByVideos } = mainSlice.actions;

export const mainData = (state: RootState) => state.main;


export default mainSlice.reducer;
