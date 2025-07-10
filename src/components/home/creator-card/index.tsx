import { Box } from '@/components';

interface CreatorCardProps {
  logo: string;
  name: string;
}

export default function CreatorCard({ logo, name }: CreatorCardProps) {
  return (
    <Box className="flex-shrink-0 w-40 h-40 bg-white rounded-full flex items-center justify-center cursor-pointer">
      <img
        src={logo}
        alt={name}
        className="w-32 h-32 rounded-full object-contain bg-white"
        draggable={false}
      />
    </Box>
  );
} 