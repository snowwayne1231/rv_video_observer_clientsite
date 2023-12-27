import React, {useState, useRef} from 'react';
import './styles/HeaderComponment.scss';

import { useAppSelector, useAppDispatch } from './store/hooks';
import {
    mainData,
    WarningKey,
} from './store/reducers/mainSlice';
import {
    videoBasicInfo,
    vStatus,
} from './store/reducers/videoSlice';
import { reloadVideos } from './store/index';
// import cnx from "classnames";

function HeaderComponment() {
    const mainAppData = useAppSelector(mainData);
    const videosInfo = useAppSelector(videoBasicInfo);
    const dispatch = useAppDispatch();
    const refListWarning = useRef<HTMLUListElement>(null);
    const [lockScroll, setLockScroll] = useState(false);
    // console.log('mainAppData: ', mainAppData);
    

    function switchContent(key:string) {
        switch (key) {
            case WarningKey.FORMAT:
                return '連續檢測到錯誤的時間格式'
            case WarningKey.DATETIME:
                return '找不到平板位置'
            case WarningKey.OVERTIME:
                return '超過一分鐘的延遲時間'
            default:
                return '未知'
        }
    }

    function onClickWarning(evt:any, id:string) {
        const domVideo : HTMLElement = document.querySelector(`#video-ranking-${id}`) as HTMLElement;
        domVideo && domVideo.click()
    }

    function onClickReload(evt:any) {
        if (videosInfo.ready) {
            reloadVideos();
        } else {
            window.alert('正在讀取中請稍後.');
        }
    }

    React.useEffect(() => {
        const wDomUlist = refListWarning.current;
        // console.log('mainAppData.history length: ', mainAppData.history.length)
        if (wDomUlist && !lockScroll) {
            const li = wDomUlist.lastElementChild;
            li && li.scrollIntoView({ block: 'end',  behavior: 'smooth' });
        }
        
    }, [mainAppData.history, lockScroll]);

    return (
        <div className="Header-componment">
            
            <div className="recent-warning">
                <ul className="warning-list" ref={refListWarning} onMouseEnter={() => setLockScroll(true)} onMouseLeave={() => setLockScroll(false)}>
                {
                    mainAppData.history.map(h => {
                        return (
                            <li className={'warning ' + (h.key)} key={h.id+h.key+h.time} onClick={e => onClickWarning(e, h.id)}>
                                <span className='timestamp'>【{h.time}】</span>
                                <span className='prefix'>{h.id}</span>
                                <span className='content'>{switchContent(h.key)}</span>
                                <span className='minute'>推測分鐘數為({h.flexible})</span>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
            <div className="controller-observer">
                <table>
                    <tbody>
                        <tr>
                            <td>已連線廳數: {videosInfo.list.filter(e => e.status == vStatus.OPEN).length}</td>
                            <td>總廳數: {videosInfo.list.length}</td>
                        </tr>
                        <tr>
                            <td><button onClick={onClickReload}>重新讀取</button></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HeaderComponment;