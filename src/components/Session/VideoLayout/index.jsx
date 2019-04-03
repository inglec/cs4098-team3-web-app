import { chunk, findIndex } from 'lodash/array';
import {
  filter,
  find,
  forEach,
  map,
} from 'lodash/collection';
import { isEmpty } from 'lodash/lang';
import { mapValues } from 'lodash/object';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { USER_ADD_MEDIA, USER_REMOVE_MEDIA } from 'app-utils/video/events';

import Video from '../Video';

import './styles';

class VideoLayout extends Component {
  constructor(props) {
    super(props);

    const { users } = props;

    this.layoutRef = null;
    this.videoContainerRefs = mapValues(users, () => null);

    this.eventListeners = [];

    this.layoutHeight = null;
    this.layoutWidth = null;
  }

  componentDidMount() {
    this.addEventListener(window, 'resize', () => this.updateLayout());
  }

  componentWillUnmount() {
    this.eventListeners.forEach(({ handler, name, ref }) => ref.removeEventListener(name, handler));
  }

  setLayoutRef(ref) {
    this.layoutRef = ref;
    this.updateLayout();
  }

  setVideoContainerRef(uid, ref) {
    this.videoContainerRefs[uid] = ref;
  }

  // Bind event listener to target and store in array for easy listener removal
  addEventListener(ref, name, handler) {
    ref.addEventListener(name, handler);
    this.eventListeners.push({ handler, name, ref });
  }

  // Recalculate video layout with new width / height of container
  updateLayout() {
    if (this.layoutRef) {
      // Get width and height of `videolayout` container
      const { clientHeight, clientWidth } = this.layoutRef;

      if (clientWidth !== this.layoutWidth || clientHeight !== this.layoutHeight) {
        this.layoutHeight = clientHeight;
        this.layoutWidth = clientWidth;
      }

      this.updateVideos();
    }
  }


  calculateVideoDimensions() {
    const { users } = this.props;

    /**
    * For this calculation, we consider each video as having dimensions n:m (aspect ratio).
    * This is converted to an integer representing the width in terms of the height in "units".
    *
    * Example: A 4:3 aspect ratio is represented as 1.3333 units.
    */
    const uids = Object.keys(users);

    // Calculate width:height ratio for each video
    const aspectRatios = mapValues(this.videoContainerRefs, (videoContainerRef) => {
      const mediaContainerRef = find(videoContainerRef.children, ({ className }) => (
        className === 'media-container'
      ));

      if (mediaContainerRef) {
        const videoRef = find(mediaContainerRef.children, ({ tagName }) => tagName === 'VIDEO');

        if (videoRef) {
          return videoRef.videoWidth / videoRef.videoHeight;
        }
      }

      return NaN;
    });

    // Calculate how many pixels a unit would equal in order to fit all videos in a row
    const calculatePixelsPerUnit = (rowUids, rowHeight) => {
      // Sum ratios (relative widths) of videos in row
      const unitWidth = rowUids.reduce((acc, uid) => acc + aspectRatios[uid], 0);

      // Calculate height of videos to fill full width of row
      const height = this.layoutWidth / unitWidth;

      // Don't exceed row height
      return Math.min(height, rowHeight);
    };

    // Increase the number of rows until there is no more vertical space
    let addNewRow;
    let rowCount = 1;
    do {
      // Split videos into array of rows
      const videosPerRow = Math.ceil(uids.length / rowCount);
      const uidsByRow = chunk(uids, videosPerRow);

      // For each row, calculate how large a unit should be in pixels
      const rowHeight = this.layoutHeight / rowCount;
      const pixelsPerUnitByRow = uidsByRow.map(row => calculatePixelsPerUnit(row, rowHeight));

      // Add another row if there is space
      const totalHeight = pixelsPerUnitByRow.reduce((acc, pixels) => acc + pixels, 0);
      const remainingHeight = this.layoutHeight - totalHeight;
      const smallestRowHeight = Math.min(...pixelsPerUnitByRow);
      const maxVideosPerRow = Math.max(...uidsByRow.map(row => row.length));
      addNewRow = smallestRowHeight < remainingHeight && maxVideosPerRow > 1;

      if (addNewRow) {
        rowCount += 1;
      } else {
        // Calculate new width of each video
        return mapValues(this.videoContainerRefs, (ref, uid) => {
          const rowIndex = findIndex(uidsByRow, row => row.includes(uid));
          const height = pixelsPerUnitByRow[rowIndex];
          const width = height * aspectRatios[uid];

          return { height, width };
        });
      }
    } while (addNewRow);

    // ESLint doesn't realise that this will never execute
    return {};
  }

  // Set width of videos to best fit container
  updateVideos() {
    // Check if refs have been obtained for all videos
    if (
      this.layoutRef
      && !isEmpty(this.videoContainerRefs)
      && filter(this.videoContainerRefs, ref => !ref).length === 0
    ) {
      // Update width of each video
      const videoDimensions = this.calculateVideoDimensions();
      forEach(videoDimensions, ({ height, width }, uid) => {
        // Set element styling
        const { style } = this.videoContainerRefs[uid];
        style.height = `${height}px`;
        style.width = `${width}px`;
      });
    }
  }

  render() {
    const { users } = this.props;

    return (
      <div className="videolayout" ref={ref => this.setLayoutRef(ref)}>
        {
          map(users, (user, uid) => (
            <Video
              displayName={null /* TODO */}
              key={uid}
              isMuted={false /* TODO */}
              isTicked={false /* TODO */}
              onLoadMetadata={() => this.updateVideos()}
              onMute={() => console.log('mute', uid) /* TODO */}
              onTick={() => console.log('tick', uid) /* TODO */}
              onUserAddMedia={callback => user.on(USER_ADD_MEDIA, callback)}
              onUserRemoveMedia={callback => user.on(USER_REMOVE_MEDIA, callback)}
              setVideoContainerRef={ref => this.setVideoContainerRef(uid, ref)}
              uid={uid}
            />
          ))
        }
      </div>
    );
  }
}

VideoLayout.propTypes = {
  users: PropTypes.objectOf(
    // FIXME
    PropTypes.any,
  ).isRequired,
};

export default VideoLayout;
