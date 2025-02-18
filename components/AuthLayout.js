import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100"
    >
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </motion.div>
  );
}