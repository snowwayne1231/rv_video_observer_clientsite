import React, {useState, useRef} from 'react';
import './styles/VideoComponment.scss';

import { useAppSelector } from './store/hooks';
import {
  videos,
  videoBasicInfo,
  vStatus,
} from './store/reducers/videoSlice';
import cnx from "classnames";
import imgGray from './images/gray.png';


function VideoComponment() {
  const listVideos = useAppSelector(videos);
  const basicInfo = useAppSelector(videoBasicInfo);
  const [isOpenRanking, setOpenRanking] = useState(false);
  const [openDialogName, setDialogName] = useState('');
  const [focusVidName, setFocusVidName] = useState('');
  const sortedRanking:any[] = [];
  listVideos.forEach(video => {
    let weight = video.wrongs.format || 0;
    if (video.status === vStatus.OPEN) {
        
        weight += video.wrongs.datetime * 2;
        weight += video.wrongs.overtime * 4;
        weight += video.warning.format ? 8 : 0;
        weight += video.warning.datetime ? 16 : 0;
        weight += video.warning.overtime ? 64 : 0;
    } else {
        weight = -1;
    }
    const idx = sortedRanking.findIndex(e => e.weight < weight);
    if (idx === -1) {
        sortedRanking.push({video, weight})
    } else {
        sortedRanking.splice(idx, 0, {video, weight})
    }
  });

  const refMainVideos = useRef<HTMLUListElement>(null);
  const targetVideo = listVideos.find(e => e.id === openDialogName);
//   console.log('targetVideo: ', targetVideo);

  function spanWhichVideoStatus(status:vStatus){
    let text = ''
    switch (status) {
        case vStatus.CLOSE: text = 'Closed'; break;
        case vStatus.LOADING: text = 'Loading'; break;
        case vStatus.FAILED: text = 'Failed'; break;
        default:
    }
    return <span className="img-text">{text}</span>
  }

  return (
    <div className="Video-componment">
        {
            basicInfo.ready ?
            <div className='videos-container'>
                <ul className="videos" ref={refMainVideos}>
                    {
                        listVideos.length > 0 ?
                        listVideos.map(video => {
                            return (
                                <li
                                    key={video.id}
                                    id={`video-data-${video.id}`}
                                    className={cnx({
                                        'video-data': true,
                                        'video-warning-datetime': video.warning.datetime,
                                        'video-warning-format': video.warning.format,
                                        'video-warning-overtime': video.warning.overtime,
                                        'video-on-focus': video.id === focusVidName,
                                    })} 
                                >
                                    <div className='video-header'>{video.id}</div>
                                    <div className='video-content'>
                                        {
                                            video.status === vStatus.OPEN ?
                                                <div onClick={e => {setDialogName(video.id); setOpenRanking(false); setFocusVidName('')}}>
                                                    <img src={`${video.img}?t=${video.timestamp}`} className="video-img" alt={video.id}></img>
                                                </div>
                                            :
                                                <div className="img-container">
                                                    <img src={imgGray} className="video-img" alt={video.id}></img>
                                                    {
                                                        spanWhichVideoStatus(video.status)
                                                    }
                                                </div>
                                        }
                                    </div>
                                    
                                </li>
                            )
                        })
                        :
                        <li className='no-data'>
                            沒有資料.
                        </li>
                    }
                </ul>
            </div>
            :
            <div className='no-data'>讀取中...</div>
        }
        
      
        <div className={cnx({'video-ranking': true, 'active': isOpenRanking})}>
            <ul className="videos">
            {
                sortedRanking.map(rank => {
                    function onClickRanking() {
                        if (refMainVideos && refMainVideos.current) {
                            const liVideo = refMainVideos.current.querySelector(`#video-data-${rank.video.id}`);
                            liVideo && liVideo.scrollIntoView({ block: 'end',  behavior: 'smooth' });
                            setDialogName('');
                            setFocusVidName(rank.video.id);
                        }
                    }

                    return (
                        <li
                            id={`video-ranking-${rank.video.id}`}
                            key={rank.video.id}
                            className={cnx({
                                'video-data': true,
                                'video-warning-datetime': rank.video.warning.datetime,
                                'video-warning-format': rank.video.warning.format,
                                'video-warning-overtime': rank.video.warning.overtime,
                                'video-failed': rank.weight == -1,
                            })}
                            onClick={onClickRanking}
                        >
                            {rank.video.id}
                        </li>
                    )
                })
            }
            </ul>
            <span className="btn-toggle" onClick={e => setOpenRanking(!isOpenRanking)}></span>
        </div>
        <div className={cnx({'video-dialog': true, 'active': openDialogName.length > 0})}>
            <div className="video-detail">
            {
                targetVideo ?
                    <div className={cnx({'detail-inner': true,  'ontime': targetVideo.ontime, 'wrong-format': targetVideo.warning.format, 'overtime': targetVideo.warning.overtime, 'no-panel': targetVideo.warning.datetime})}>
                        <div className="header overtime format datetime">{targetVideo.id}</div>
                        <img className="overtime format datetime" src={`${targetVideo.img}?t=${targetVideo.timestamp}`} alt={targetVideo.id}></img>
                        <div>
                            <table className={cnx({'detail-table': true})}>
                                <tbody>
                                    <tr>
                                        <th>推測分鐘數:</th>
                                        <td className='overtime'>{targetVideo.minute}</td>
                                        <th>解析數字:</th>
                                        <td className='format'>( {targetVideo.minuteLast} ) - {targetVideo.parsedDigits.join(', ')}</td>
                                        <th>截圖UTC時間:</th>
                                        <td>{new Date(targetVideo.timestamp).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th>連續延遲次數:</th>
                                        <td className='overtime'>{targetVideo.wrongs.overtime}</td>
                                        <th>連續格式錯誤次數:</th>
                                        <td className='format'>{targetVideo.wrongs.format}</td>
                                        <th>連續定位錯誤次數:</th>
                                        <td className='datetime'>{targetVideo.wrongs.datetime}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                :   <div>
                        
                    </div>
            }
            <button className="btn-close" onClick={e => setDialogName('')}>Close</button>
            </div>
        </div>
    </div>
  );
}

export default VideoComponment;
