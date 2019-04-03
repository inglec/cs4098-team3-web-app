import MuteIcon from 'react-feather/dist/icons/volume-x';
import TickIcon from 'react-feather/dist/icons/check';
import PropTypes from 'prop-types';
import React from 'react';

import Media from './Media';

import './styles';

const renderControls = (isMuted, onMute, isTicked, onTick, isSelfVideo) => {
  const getControlClass = selected => `control-button${selected ? ' control-button-selected' : ''}`;

  return (
    <div className="video-overlay-controls">
      <button type="button" className={getControlClass(isMuted)} onClick={onMute}>
        <MuteIcon />
      </button>
      {
        isSelfVideo
          ? null
          : (
            <button type="button" className={getControlClass(isTicked)} onClick={onTick}>
              <TickIcon />
            </button>
          )
      }
    </div>
  );
};

const renderOverlay = (uid, displayName, isMuted, onMute, isTicked, onTick, isSelfVideo) => (
  <div className="video-overlay">
    <div className="video-overlay-row">
      <div className="video-overlay-name">
        {displayName ? `${displayName} (${uid})` : uid}
      </div>
    </div>
    <div className="video-overlay-row">
      {renderControls(isMuted, onMute, isTicked, onTick, isSelfVideo)}
    </div>
  </div>
);

const Video = (props) => {
  const {
    displayName,
    isMuted,
    isSelfVideo,
    isTicked,
    onLoadMetadata,
    onMute,
    onTick,
    onUserAddMedia,
    onUserRemoveMedia,
    setVideoContainerRef,
    uid,
  } = props;

  return (
    <div className="video-container" ref={setVideoContainerRef}>
      <Media
        onLoadMetadata={onLoadMetadata}
        onUserAddMedia={onUserAddMedia}
        onUserRemoveMedia={onUserRemoveMedia}
      />
      {renderOverlay(uid, displayName, isMuted, onMute, isTicked, onTick, isSelfVideo)}
    </div>
  );
};

Video.propTypes = {
  isMuted: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,

  displayName: PropTypes.string,
  isTicked: PropTypes.bool,
  onLoadMetadata: PropTypes.func,
  onMute: PropTypes.func,
  onTick: PropTypes.func,
  onUserAddMedia: PropTypes.func,
  onUserRemoveMedia: PropTypes.func,
  isSelfVideo: PropTypes.bool,
  setVideoContainerRef: PropTypes.func,
};

Video.defaultProps = {
  displayName: '',
  isSelfVideo: false,
  isTicked: false,
  onLoadMetadata: () => {},
  onMute: () => {},
  onTick: () => {},
  onUserAddMedia: () => {},
  onUserRemoveMedia: () => {},
  setVideoContainerRef: () => {},
};

export default Video;
