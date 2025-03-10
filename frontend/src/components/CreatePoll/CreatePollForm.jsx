import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaPoll } from 'react-icons/fa';
import styles from './CreatePoll.module.css';

const CreatePollForm = ({ onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    const filteredOptions = options.filter(option => option.trim() !== '');
    if (filteredOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }
    
    // Create poll
    onCreatePoll({ question, options: filteredOptions });
    
    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.formContainer}
    >
      <h2 className={styles.title}>
        <FaPoll className={styles.icon} />
        Create New Poll
      </h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question"
            className={styles.input}
          />
        </div>
        
        <div className={styles.optionsContainer}>
          <label>Options</label>
          {options.map((option, index) => (
            <div key={index} className={styles.optionRow}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={styles.input}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className={styles.removeButton}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          
          {options.length < 6 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAddOption}
              className={styles.addButton}
            >
              <FaPlus /> Add Option
            </motion.button>
          )}
        </div>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={styles.submitButton}
        >
          Create Poll
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreatePollForm;