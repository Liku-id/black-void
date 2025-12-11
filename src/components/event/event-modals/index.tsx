import React from 'react';
import { Box, Button, Typography, Modal } from '@/components';

interface EventModalsProps {
  showExpiredModal: boolean;
  showEventEndedModal: boolean;
  onCloseExpiredModal: () => void;
  onCloseEventEndedModal: () => void;
  onExpiredBuyTicket: () => void;
  onGoToHomepage: () => void;
}

const EventModals: React.FC<EventModalsProps> = ({
  showExpiredModal,
  showEventEndedModal,
  onCloseExpiredModal,
  onCloseEventEndedModal,
  onExpiredBuyTicket,
  onGoToHomepage,
}) => {
  return (
    <>
      {/* Expired Partner Code Modal */}
      <Modal
        open={showExpiredModal}
        onClose={onCloseExpiredModal}
        title="THIS LINK ALREADY EXPIRED!"
        className="md:w-[454px]"
        footer={
          <Box className="flex justify-end">
            <Button
              type="button"
              onClick={onExpiredBuyTicket}
              className="bg-green px-6 py-3 text-white font-bebas text-[22px] uppercase"
            >
              Buy Ticket
            </Button>
          </Box>
        }
      >
        <Box className="mb-6">
          <Typography type="body" size={14} color="text-white">
            This link already expired, but you still can buy ticket with normal
            price
          </Typography>
        </Box>
      </Modal>

      {/* Event Ended Modal */}
      <Modal
        open={showEventEndedModal}
        onClose={onCloseEventEndedModal}
        title="THIS LINK ALREADY EXPIRED!"
        className="md:w-[454px]"
        footer={
          <Box className="flex justify-end">
            <Button
              type="button"
              onClick={onGoToHomepage}
              className="bg-green px-6 py-3 text-white font-bebas text-[22px] uppercase"
            >
              Go to Homepage
            </Button>
          </Box>
        }
      >
        <Box className="mb-6">
          <Typography type="body" size={14} color="text-white">
            This event has been ended. Find another exciting event to attend on
            Wukong
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default EventModals;
