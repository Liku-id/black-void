import { Box } from '@/components';

interface CreatorCardProps {
  logo: string;
  name: string;
}

export default function CreatorCard({ logo, name }: CreatorCardProps) {
  return (
    <Box className="flex h-40 w-40 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-white">
      <img
        src={logo}
        alt={name}
        className="h-32 w-32 rounded-full bg-white object-contain"
        draggable={false}
      />
    </Box>
  );
}
