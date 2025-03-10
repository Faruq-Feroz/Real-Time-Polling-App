import React, { useEffect, useState, useLayoutEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';
import CreatePollForm from './components/CreatePoll/CreatePollForm';
import PollsList from './components/PollList/PollList';
import PollDetail from './components/PollDetails/PollDetails';

// Create socket instance
const socket = io('http://localhost:4000');

function App() {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();

    socket.on('connect', () => {
      toast.success('Connected to real-time updates!');
    });

    socket.on('pollData', (updatedPoll) => {
      setPolls(prevPolls => {
        const updatedPolls = prevPolls.map(poll => 
          poll._id === updatedPoll._id ? updatedPoll : poll
        );
        
        if (selectedPoll && selectedPoll._id === updatedPoll._id) {
          setSelectedPoll(updatedPoll);
        }
        
        return updatedPolls;
      });

      toast.info('Poll updated in real-time!');
    });

    return () => {
      socket.off('connect');
      socket.off('pollData');
    };
  }, [selectedPoll]);

  
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPoll]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/polls');
      setPolls(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast.error('Failed to load polls');
      setLoading(false);
    }
  };

  const handleCreatePoll = async (pollData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/polls', pollData);
      setPolls([...polls, response.data]);
      toast.success('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll');
    }
  };

  const handleVote = async (pollId, option) => {
    try {
      await axios.post('http://localhost:4000/api/polls/vote', { pollId, option });
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleClosePoll = async (pollId) => {
    try {
      await axios.post(`http://localhost:4000/api/polls/close/${pollId}`);
      toast.info('Poll closed successfully');
    } catch (error) {
      console.error('Error closing poll:', error);
      toast.error('Failed to close poll');
    }
  };

  const handleSelectPoll = (poll) => {
    setSelectedPoll(poll);
  };

  const handleBackToList = () => {
    setSelectedPoll(null);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Real-Time Polling App</h1>
        <p>Create polls and see results in real-time</p>
      </header>

      <main className={styles.main}>
        {!selectedPoll ? (
          <>
            <section className={styles.createPollSection}>
              <CreatePollForm onCreatePoll={handleCreatePoll} />
            </section>
            <section className={styles.pollsListSection}>
              <PollsList 
                polls={polls} 
                loading={loading}
                onSelectPoll={handleSelectPoll}
              />
            </section>
          </>
        ) : (
          <div className={styles.pollDetail}>
            <PollDetail 
              poll={selectedPoll} 
              onVote={handleVote} 
              onClose={handleClosePoll}
              onBack={handleBackToList}
            />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Real-Time Polling System</p>
      </footer>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
