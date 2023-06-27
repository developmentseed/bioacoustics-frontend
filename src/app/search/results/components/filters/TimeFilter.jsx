import { useState } from 'react';
import T from 'prop-types';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const formatTime = (hour) => {
  if (hour === 24) {
    return '00:00';
  }
  if (hour < 10) {
    return `0${hour}:00`;
  }
  return `${hour}:00`;
};

export default function TimeFilter({ setSelectedTimes }) {
  const [intermediateTime, setIntermediateTime] = useState([0, 24]);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button size="sm" variant="outline" rightIcon={<MdKeyboardArrowDown />}>Time</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent pt="1">
          <PopoverBody>
            <RangeSlider
              min={0}
              max={24}
              value={intermediateTime}
              onChange={setIntermediateTime}
              onChangeEnd={setSelectedTimes}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <RangeSliderTrack bg="neutral.100">
                <RangeSliderFilledTrack bg="primary.400" />
              </RangeSliderTrack>
              <Tooltip
                hasArrow
                bg="white"
                color="neutral.500"
                placement="top"
                isOpen={showTooltip}
                label={formatTime(intermediateTime[0])}
              >
                <RangeSliderThumb index={0} />
              </Tooltip>
              <Tooltip
                hasArrow
                bg="white"
                color="neutral.500"
                placement="top"
                isOpen={showTooltip}
                label={formatTime(intermediateTime[1])}
              >
                <RangeSliderThumb index={1} />
              </Tooltip>
            </RangeSlider>
            <Text fontSize="xs" mt="2">All times are in UTC</Text>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

TimeFilter.propTypes = {
  setSelectedTimes: T.func.isRequired
};
