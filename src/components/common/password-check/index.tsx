import Image from 'next/image';
import { Box } from '../box';
import { Typography } from '../typography';
import checkedIcon from '@/assets/icons/checked.svg';

interface PasswordCheckProps {
  label: string;
  checked: boolean;
}

export const PasswordCheck: React.FC<PasswordCheckProps> = ({
  label,
  checked,
}: PasswordCheckProps) => (
  <Box className="flex items-center gap-4">
    {checked ? (
      <Image src={checkedIcon} alt="checkbox" width={24} height={24} />
    ) : (
      <Box className="w-6 h-6 aspect-square border border-white" />
    )}
    <Typography size={12} className="text-white">
      {label}
    </Typography>
  </Box>
);
