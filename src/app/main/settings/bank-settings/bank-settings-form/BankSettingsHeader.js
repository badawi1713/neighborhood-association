import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip } from '@mui/material';
import Typography from '@mui/material/Typography';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

function BankSettingsHeader() {
  const { data } = useSelector((state) => state.bankSettingsReducer);
  const converStatus = (status) => {
    switch (status) {
      case 'Sudah Verifikasi':
        return 'success';
      case 'Belum Verifikasi':
        return 'error';
      default:
        return 'info';
    }
  };

  const converStatusIcon = (status) => {
    switch (status) {
      case 'Sudah Verifikasi':
        return 'heroicons-solid:badge-check';
      case 'Belum Verifikasi':
        return 'heroicons-solid:x';
      default:
        return 'heroicons-outline:question-mark-circle';
    }
  };

  return (
    <section className="flex flex-col gap-16 flex-1 w-full py-32 px-24 md:px-32">
      <div className="flex flex-col gap-16 items-center md:items-baseline md:flex-row justify-between">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight"
        >
          Form Pengaturan Bank
        </Typography>
        <div className="flex flex-col gap-16 items-center md:items-start">
          <Chip
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            color={converStatus(data?.status_name || 'Status Verifikasi')}
            className="px-10 md:w-full"
            icon={<FuseSvgIcon color="white">{converStatusIcon(data?.status_name)}</FuseSvgIcon>}
            label={data?.status_name}
          />
          <Typography
            variant="body2"
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
          >
            Terakhir Diperbarui: {data?.last_updated || '-'}
          </Typography>
        </div>
      </div>
    </section>
  );
}

export default BankSettingsHeader;
