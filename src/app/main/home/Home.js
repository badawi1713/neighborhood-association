import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { selectUser } from 'app/store/userSlice';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useSelector } from 'react-redux';

function Home() {
  const user = useSelector(selectUser);
  const currentHour = moment().format('HH');

  function generateGreetings() {
    if (currentHour >= 3 && currentHour < 12) {
      return 'Selamat Pagi';
    }
    if (currentHour >= 12 && currentHour < 15) {
      return 'Selamat Siang';
    }
    if (currentHour >= 15 && currentHour < 19) {
      return 'Selamat Sore';
    }
    return 'Selamat Malam';
  }

  function generateGreetingIcons() {
    if (currentHour >= 3 && currentHour < 12) {
      return 'feather:sun';
    }
    if (currentHour >= 12 && currentHour < 19) {
      return 'feather:cloud';
    }
    return 'feather:moon';
  }

  return (
    <div className="flex flex-col flex-auto min-w-0">
      <Box
        className="relative overflow-hidden bg-cover bg-no-repeat bg-center min-h-full"
        sx={{
          backgroundColor: 'secondary.main',
        }}
      >
        <div className="flex flex-col items-center justify-center px-16 sm:px-64 z-30 relative mx-auto h-full w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0 } }}>
            <Typography
              color="inherit"
              className="text-24 font-semibold text-grey-100 flex items-center gap-8 mb-10"
            >
              {generateGreetings()}{' '}
              <FuseSvgIcon size={32} className="text-grey-100">
                {generateGreetingIcons()}
              </FuseSvgIcon>
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0 } }}>
            <Typography className="mt-4 text-32 sm:text-48 font-extrabold tracking-tight leading-tight text-center text-white">
              {user.data.displayName}
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
            <Typography
              color="text.secondary"
              className="mt-12 sm:text-20 text-center tracking-tight text-grey-200"
            >
              Terima kasih sudah mengunjungi situs dashboard Zonapay
            </Typography>
          </motion.div>
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              className="text-gray-100 opacity-25"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </g>
          </svg>
        </div>
      </Box>
    </div>
  );
}

export default Home;
