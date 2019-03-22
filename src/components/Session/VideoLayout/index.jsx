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
import React, { Component, createRef } from 'react';

import { USER_ADD_MEDIA, USER_REMOVE_MEDIA } from 'app-utils/video/events';

import Video from './Video';

import './styles';

class VideoLayout extends Component {
  constructor(props) {
    super(props);

    const { users } = props;

    this.layoutRef = createRef();
    this.mediaContainerRefs = mapValues(users, createRef);

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

  setMediaContainerRef(uid, ref) {
    this.mediaContainerRefs[uid] = ref;

    if (ref) {
      // Search for <video> element within media container <div>
      const video = find(ref.children, child => child.tagName.toLowerCase() === 'video');
      if (video) {
        /**
         * After `srcObject` is added to the <video> element, there is a short period of time
         * where videoHeight and videoWidth will change. We need to listen for this and update.
         */
        this.addEventListener(video, 'loadedmetadata', () => this.updateVideos());
      }
    }
  }

  // Bind event listener to target and store in array for easy listener removal
  addEventListener(ref, name, handler) {
    ref.addEventListener(name, handler);
    this.eventListeners.push({ handler, name, ref });
  }

  // Update state with new width / height of container
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


  calculateVideoWidths() {
    const { users } = this.props;

    /**
    * For this calculation, we consider each video as having dimensions n:m (aspect ratio).
    * This is converted to an integer representing the width in terms of the height in "units".
    *
    * Example: A 4:3 aspect ratio is represented as 1.3333 units.
    */
    const uids = Object.keys(users);

    // Calculate width:height ratio for each video
    const aspectRatios = mapValues(this.mediaContainerRefs, (ref) => {
      const { clientWidth, clientHeight } = ref;

      return clientWidth / clientHeight;
    });

    // Calculate how many pixels a unit would equal in order to fit all videos in a row
    const calculatePixelsPerUnit = (rowUids, height) => {
      // Sum ratios (relative widths) of videos in row
      const unitWidth = rowUids.reduce((acc, uid) => acc + aspectRatios[uid], 0);

      return Math.min(this.layoutWidth / unitWidth, height);
    };

    // Increase the number of rows until there is no more vertical space
    let addNewRow = true;
    let rowCount = 1;
    while (addNewRow) {
      // Split videos into array of rows
      const videosPerRow = Math.ceil(uids.length / rowCount);
      const uidsByRow = chunk(uids, videosPerRow);

      // For each row, calculate how large a unit should be in pixels
      // eslint-disable-next-line no-loop-func
      const rowHeight = Math.floor(this.layoutHeight / rowCount);
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
        return mapValues(this.mediaContainerRefs, (ref, uid) => {
          const rowIndex = findIndex(uidsByRow, row => row.includes(uid));
          const pixelsPerUnit = pixelsPerUnitByRow[rowIndex];

          return aspectRatios[uid] * pixelsPerUnit;
        });
      }
    }

    // ESLint doesn't realise that this will never execute
    return {};
  }

  // Set width of videos to best fit container
  updateVideos() {
    // Check if refs have been obtained for all videos
    if (
      this.layoutRef
      && !isEmpty(this.mediaContainerRefs)
      && filter(this.mediaContainerRefs, ref => !ref).length === 0
    ) {
      // Update width of each video
      const videoWidths = this.calculateVideoWidths();
      forEach(videoWidths, (videoWidth, uid) => {
        // Set element styling
        const { style } = this.mediaContainerRefs[uid];
        style.width = `${videoWidth}px`;
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
              key={uid}
              uid={uid}
              onUserAddMedia={callback => user.on(USER_ADD_MEDIA, callback)}
              onUserRemoveMedia={callback => user.on(USER_REMOVE_MEDIA, callback)}
              setRef={ref => this.setMediaContainerRef(uid, ref)}
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
