import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';


export default function Chatbot() {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div>
      <Box 
<<<<<<< HEAD
<<<<<<< HEAD
        className={`fixed z-20 bottom-4 right-8 rounded-full hover:-translate-y-2 hover:opacity-75 duration-300 shadow`}
        sx={{
            backgroundColor: '#fcfcfc', 
=======
        className={`fixed z-20 bottom-4 right-8 rounded-full hover:-translate-y-2 duration-300 shadow`}
        sx={{
            backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[300] : '#fcfcfc', 
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
=======
        className={`fixed z-20 bottom-4 right-8 rounded-full hover:-translate-y-2 duration-300 shadow`}
        sx={{
            backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[300] : '#fcfcfc', 
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)
        }}
        onClick={handleOpen}
      >
        <img 
            className='w-10 h-10 object-cover bg-transparent p-2 pointer-events-none'
            src="images/chatbot_ia.png" 
            alt="Assistant IA" 
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box 
            sx={{
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: 24,
                p: 4,
                borderRadius: '5px'
            }}
        >
          <Typography id="modal-modal-title" sx={{ fontWeight: 600 }} variant="h3" component="h2">
            Bientot disponible
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Nous nous excusons de la rupture de cette service
          </Typography>
        </Box>
      </Modal>
    </div>
  );
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
=======
}
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)
