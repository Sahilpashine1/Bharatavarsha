import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import TimelineSlider from '../components/TimelineSlider';

const TimelinePage = () => {
    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <TimelineSlider />
            </motion.div>
        </Layout>
    );
};

export default TimelinePage;
