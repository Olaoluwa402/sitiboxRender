import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import {ImCheckboxChecked} from 'react-icons/im';

import styled from "./Downloader.module.css";


const Downloader = ({files = [], remove}) => {
	return(
		<div className={styled.downloader}>
			<div className={styled.card}>
				<div className={styled.cardHeader}>File Downloader</div>
				<ul className={styled.listGroup}>
					{files.map((file, idx) => (
						<DownloadItem 
							key={idx}
							removeFile={() => remove(file.downloadId)}
							{...file}
						/>))}
				</ul>
			</div>
		</div>
	)
};

const formatBytes = bytes => `${(bytes / (1024*1024)).toFixed(2)} Mb`

const DownloadItem = ({name, file, filename, removeFile}) => {

	const [downloadInfo, setDownloadInfo] = useState({
		progress:0,
		completed:false,
		total:0,
		loaded:0
	})

	useEffect(() => {
		makeAPIRequest()
	}, [])

	const makeAPIRequest = () => {

		const options = {
			onDownloadProgress: (progressEvent) => {
				const {loaded, total} = progressEvent;

				setDownloadInfo({
					progress:Math.floor((loaded * 100)/total),
					loaded,
					total,
					completed:false
				})
			}
		}
		
		Axios.get(file,{
			responseType:"blob",
			...options
		}).then(function(response){

			if(response){
				const url = window.URL.createObjectURL(
				new Blob([response.data], {
					type:response.headers['content-type']
				})	
			)

			const link = document.createElement('a');
			link.href = url;
			link.target = '_blank';
			link.setAttribute = ('download', filename);
			document.body.appendChild(link);
			link.click();

			setDownloadInfo((info) => ({
		        ...info,
		        completed: true,
		      }));

			setTimeout(() =>{
				removeFile()
			}, 4000);
			}
		})
	}


	const Progress = ({done}) => {
		const [style, setStyle] = React.useState({});
		
		setTimeout(() => {
			const newStyle = {
				opacity: 1,
				width: `${done}%`
			}
			
			setStyle(newStyle);
		}, 200);
		
		return (
			<div className={styled.progress}>
				<div className={styled.progressDone} style={style}>
					{done}%
				</div>
			</div>
		)
	}

	return (
		 <li className="list-group-item">
	      <div className="row">
	        <div className={styled.col12}>
	          <div className={styled.dInline}>{name}</div>
	          <div className={styled.dInline}>
	            <small>
	              {downloadInfo.loaded > 0 && (
	                <>
	                  <span className={styled.textSuccess}>
	                    {formatBytes(downloadInfo.loaded)}
	                  </span>
	                  / {formatBytes(downloadInfo.total)}
	                </>
	              )}

	              {downloadInfo.loaded === 0 && <>Initializing...</>}
	            </small>
	          </div>
	          <div className={styled.dInline}>
	            {downloadInfo.completed && (
	              <span className={styled.textSuccess}>
	                Completed <ImCheckboxChecked />
	              </span>
	            )}
	          </div>
	        </div>
	        <div className={styled.col12}>
	          <Progress done={downloadInfo.progress}/>
	        </div>
	      </div>
    </li>
)
};

export default Downloader;

