import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { FaArrowLeft, FaChartBar, FaVoteYea, FaLock } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './PollDetails.module.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PollDetail = ({ poll, onVote, onClose, onBack }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (poll) {
      updateChartData();
    }
  }, [poll]);
  
  const updateChartData = () => {
    // Convert Map to regular object if needed
    const votesObject = poll.votes instanceof Map 
      ? Object.fromEntries(poll.votes) 
      : poll.votes;
    
    // Create chart data
    const data = {
      labels: poll.options,
      datasets: [
        {
          label: 'Votes',
          data: poll.options.map(option => votesObject[option] || 0),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    setChartData(data);
  };
  
  const handleSubmitVote = () => {
    if (selectedOption && !hasVoted && poll.isActive) {
      onVote(poll._id, selectedOption);
      setHasVoted(true);
    }
  };
  
  const handleClosePoll = () => {
    onClose(poll._id);
  };
  
  // Calculate total votes
  const totalVotes = poll.votes ? 
    Object.values(poll.votes instanceof Map ? Object.fromEntries(poll.votes) : poll.votes)
      .reduce((sum, count) => sum + parseInt(count), 0) : 0;
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Poll Results',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = totalVotes > 0 
              ? ((value / totalVotes) * 100).toFixed(1) 
              : 0;
            return `${value} votes (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          <FaArrowLeft /> Back to Polls
        </button>
        
        {poll.isActive && (
          <button className={styles.closeButton} onClick={handleClosePoll}>
            <FaLock /> Close Poll
          </button>
        )}
      </div>
      
      <div className={styles.pollContent}>
        <h2 className={styles.question}>{poll.question}</h2>
        
        <div className={styles.statusBadge}>
          <span className={poll.isActive ? styles.activeStatus : styles.closedStatus}>
            {poll.isActive ? 'Active' : 'Closed'}
          </span>
        </div>
        
        <div className={styles.votingSection}>
          {poll.isActive && !hasVoted ? (
            <div className={styles.optionsContainer}>
              <h3 className={styles.sectionTitle}>
                <FaVoteYea className={styles.sectionIcon} />
                Cast Your Vote
              </h3>
              
              <div className={styles.options}>
                {poll.options.map((option) => (
                  <div 
                    key={option}
                    className={`${styles.optionItem} ${selectedOption === option ? styles.selected : ''}`}
                    onClick={() => setSelectedOption(option)}
                  >
                    <div className={styles.radio}>
                      {selectedOption === option && <div className={styles.radioFill}></div>}
                    </div>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.voteButton}
                onClick={handleSubmitVote}
                disabled={!selectedOption}
              >
                Submit Vote
              </motion.button>
            </div>
          ) : (
            <div className={styles.votedMessage}>
              {hasVoted ? (
                <p>Thank you for voting! Real-time results are shown below.</p>
              ) : (
                <p>This poll is closed. Results are shown below.</p>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.resultsSection}>
          <h3 className={styles.sectionTitle}>
            <FaChartBar className={styles.sectionIcon} />
            Results
            <span className={styles.totalVotes}>
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
            </span>
          </h3>
          
          {chartData && (
            <div className={styles.chartContainer}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
          
          <div className={styles.resultsList}>
            {poll.options.map((option) => {
              const votesObject = poll.votes instanceof Map 
                ? Object.fromEntries(poll.votes) 
                : poll.votes;
              
              const votes = votesObject[option] || 0;
              const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
              
              return (
                <div key={option} className={styles.resultItem}>
                  <div className={styles.resultInfo}>
                    <span className={styles.resultLabel}>{option}</span>
                    <span className={styles.resultCount}>{votes} votes ({percentage}%)</span>
                  </div>
                  <div className={styles.progressContainer}>
                    <div 
                      className={styles.progressBar} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PollDetail;