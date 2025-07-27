import { Box } from '@/components';

interface CreatorCardProps {
  logo?: string;
  name?: string;
  skeleton?: boolean;
}

export default function CreatorCard({
  logo,
  name,
  skeleton = false,
}: CreatorCardProps) {
  if (skeleton) {
    return (
      <Box className={`flex h-40 w-40 flex-shrink-0 animate-pulse items-center justify-center rounded-full bg-white mx-2`}>
        <Box className="h-32 w-32 rounded-full bg-gray-300" />
      </Box>
    );
  }
  return (
    <Box className={`flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-full bg-white mx-2`}>
      <img
        src={logo}
        alt={name}
        className="h-32 w-32 rounded-full bg-white object-contain"
        draggable={false}
      />
    </Box>
  );
}
