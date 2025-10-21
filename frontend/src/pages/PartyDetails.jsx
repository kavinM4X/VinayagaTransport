import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Share2, 
  Calendar, 
  MapPin, 
  Phone, 
  Package,
  Clock,
  Save,
  X
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import PartyForm from '@pages/PartyForm';
import { toast } from 'react-hot-toast';
import { formatDate } from '@utils';
import { partyService } from '@services/partyService';

const PartyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [party, setParty] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const isEdit = searchParams.get('edit') === '1' || id === 'new';
  const isNew = id === 'new';

  useEffect(() => {
    fetchPartyData();
  }, [id]);

  const fetchPartyData = async () => {
    try {
      setLoading(true);
      
      if (isNew) {
        setParty({});
        setLoading(false);
        return;
      }

      const [partyData, historyData] = await Promise.all([
        partyService.getParty(id),
        partyService.getPartyHistory(id).catch(() => [])
      ]);

      setParty(partyData);
      setHistory(historyData);
    } catch (error) {
      toast.error('Failed to load party details');
      navigate('/parties');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      
      if (isNew) {
        const newParty = await partyService.createParty(formData);
        toast.success('Party created successfully!');
        navigate(`/parties/${newParty._id}`);
      } else {
        await partyService.updateParty(id, formData);
        const updatedParty = await partyService.getParty(id);
        setParty(updatedParty);
        toast.success('Party updated successfully!');
        navigate(`/parties/${id}`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save party');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${party.partyName} - Transport Details`,
        text: `Party: ${party.partyName}\nPhone: ${party.phone}\nFrom: ${party.place}\nTo: ${party.sellingPlace}\nQuantity: ${party.quantity}`,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      const shareText = `Party: ${party.partyName}\nPhone: ${party.phone}\nFrom: ${party.place}\nTo: ${party.sellingPlace}\nQuantity: ${party.quantity}`;
      await navigator.clipboard.writeText(shareText);
      toast.success('Details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/parties')}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'Add New Party' : 'Party Details'}
          </h1>
          {!isNew && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage party information and history
            </p>
          )}
        </div>

        {!isNew && !isEdit && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/parties/${id}?edit=1`)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              onClick={handleShare}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Share
            </Button>
          </div>
        )}
      </div>

      {isEdit ? (
        <Card className="p-6">
          <PartyForm
            initialData={party || {}}
            onSubmit={handleSave}
            loading={saving}
            onCancel={() => navigate(isNew ? '/parties' : `/parties/${id}`)}
          />
        </Card>
      ) : party ? (
        <div className="space-y-6">
          {/* Party Information */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-transport-orange" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {party.partyName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Party Name</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {party.phone || 'Not provided'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {party.place || 'Not specified'} → {party.sellingPlace || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {party.quantity || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                  </div>
                </div>
              </div>
            </div>

            {party.reminder && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(party.reminder, 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(party.reminder) <= new Date() ? 'Overdue' : 'Upcoming reminder'}
                    </p>
                  </div>
                  <Badge 
                    variant={new Date(party.reminder) <= new Date() ? 'error' : 'warning'}
                  >
                    {new Date(party.reminder) <= new Date() ? 'Overdue' : 'Pending'}
                  </Badge>
                </div>
              </div>
            )}
          </Card>

          {/* Batch Information */}
          {(party.batchFrom || party.batchTo) && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Batch Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {party.batchFrom && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        From: {formatDate(party.batchFrom, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                {party.batchTo && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        To: {formatDate(party.batchTo, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* History */}
          {history.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Edit History
              </h3>
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(entry.createdAt, 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default PartyDetails;

