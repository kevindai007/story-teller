import React from 'react';
import { STORY_TYPES } from '../constants';

const StoryTypeSelector = ({ storyType, onStoryTypeChange, disabled }) => {
  const handleChange = (e) => {
    onStoryTypeChange(e.target.value);
  };

  const selectedType = STORY_TYPES.find(type => type.value === storyType);

  return (
    <div className="story-type-selector">
      <label htmlFor="story-type" className="selector-label">
        Story Type:
      </label>
      <div className="selector-container">
        <select
          id="story-type"
          value={storyType}
          onChange={handleChange}
          disabled={disabled}
          className="story-type-select"
        >
          {STORY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {selectedType && (
          <div className="story-type-description">
            {selectedType.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryTypeSelector;
