import { useEffect, useState } from 'react';
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

import formatHour from './formatHour';

export default function TimeFilter({ selectedTimes, setSelectedTimes }) {
  const [intermediateTime, setIntermediateTime] = useState([0, 24]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setIntermediateTime(selectedTimes);
  }, [selectedTimes]);

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
                label={formatHour(intermediateTime[0])}
              >
                <RangeSliderThumb index={0} />
              </Tooltip>
              <Tooltip
                hasArrow
                bg="white"
                color="neutral.500"
                placement="top"
                isOpen={showTooltip}
                label={formatHour(intermediateTime[1])}
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
  selectedTimes: T.arrayOf(T.number).isRequired,
  setSelectedTimes: T.func.isRequired
};
