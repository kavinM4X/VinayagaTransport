import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ArrowRight, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  Phone,
  MapPin
} from 'lucide-react';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';

const Welcome = () => {
  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Party Management',
      description: 'Efficiently manage transport parties with detailed tracking'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboard with insights and statistics'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Access',
      description: 'Role-based authentication with secure data handling'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast & Responsive',
      description: 'Modern UI with lightning-fast performance'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'WhatsApp Integration',
      description: 'Share party details directly via WhatsApp'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Route Tracking',
      description: 'Track from origin to destination with reminders'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-gray-900 via-transport-orangeLight dark:via-gray-800 to-primary-100 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-transport-orange rounded-full mx-auto mb-8 flex items-center justify-center"
          >
            <Package className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Vinagaya Transport
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Professional-grade Transport Management System with modern UI/UX design, 
            advanced analytics, and seamless user experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              as={Link}
              to="/login"
              variant="primary"
              size="lg"
              leftIcon={<Zap className="w-5 h-5" />}
            >
              Sign In
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Vinagaya Transport?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-4 flex items-center justify-center text-primary-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Trusted by Transport Companies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-transport-orange mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transport-orange mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-400">Parties Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-transport-orange mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-transport-orange to-transport-orangeDark text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Transport Management?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who trust Vinagaya Transport for their transport operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as={Link}
                to="/register"
                variant="secondary"
                size="lg"
                className="bg-white text-transport-orange hover:bg-gray-100"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Create Account
              </Button>
              <Button
                as={Link}
                to="/login"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-transport-orange"
              >
                Sign In
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Vinagaya Transport. All rights reserved. Built with ❤️ for better transport management.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;

