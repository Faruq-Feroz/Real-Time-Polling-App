import React from 'react';
import { motion } from 'framer-motion';
import { FaList, FaChartPie, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import styles from './PollList.module.css';

const PollsList = ({ polls, loading, onSelectPoll }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Calculate total votes for a poll
  const getTotalVotes = (votes) => {
    return Array.from(Object.values(votes)).reduce((sum, count) => sum + count, 0);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <FaList className={styles.icon} />
        Available Polls
      </h2>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading polls...</p>
        </div>
      ) : polls.length === 0 ? (
        <div className={styles.emptyState}>
          <FaExclamationCircle className={styles.emptyIcon} />
          <p>No polls available</p>
          <p className={styles.emptySubtext}>Create a new poll to get started</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={styles.pollsList}
        >
          {polls.map((poll) => (
            <motion.div
              key={poll._id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className={styles.pollCard}
              onClick={() => onSelectPoll(poll)}
            >
              <h3 className={styles.pollQuestion}>{poll.question}</h3>
              
              <div className={styles.pollMeta}>
                <div className={styles.metaItem}>
                  <FaChartPie className={styles.metaIcon} />
                  <span>{getTotalVotes(poll.votes)} votes</span>
                </div>
                
                <div className={styles.metaItem}>
                  <FaCalendarAlt className={styles.metaIcon} />
                  <span>{formatDate(poll.createdAt || new Date())}</span>
                </div>
              </div>
              
              <div className={styles.status}>
                <span className={poll.isActive ? styles.activeStatus : styles.closedStatus}>
                  {poll.isActive ? 'Active' : 'Closed'}
                </span>
              </div>

              {/* Vote Button */}
              {poll.isActive && (
                <button 
                  className={styles.voteButton} 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event from triggering
                    onSelectPoll(poll); // Call the function to handle navigation
                  }}
                >
                  Vote
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PollsList;
