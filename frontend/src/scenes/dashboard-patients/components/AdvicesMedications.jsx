import { Box, Typography, useTheme } from "@mui/material"
import { tokens } from "../../../theme"
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { GiHealthPotion } from "react-icons/gi";



const advicesMedications = [
    {
        name: 'Faire du sport',
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt ratione quasi vel sequi consectetur qui, placeat iusto sit ipsum, reprehenderit id eos minima temporibus quos excepturi unde harum reiciendis labore!',
        averageData: '27',
        icon: <AddToQueueIcon 
                sx={{ 
                    color: 'green', 
                    padding: '4px',
                    fontSize: '34px',
                    marginTop: '-4px',
                    borderRadius: '50%',
                }} 
            />
    },
    {
        name: '8h de temps de sommeil',
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam at iusto possimus magnam autem. Accusantium.',
        averageData: '120/80',
        icon: <FolderSharedOutlinedIcon
        sx={{ 
            color: 'blue', 
            padding: '4px',
            fontSize: '30px',
            borderRadius: '50%',
        }} 
        />
    },
    {
        name: 'Manger tard la nuit',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus soluta, et, debitis consequatur quos nihil molestiae pariatur fugit aperiam quaerat aliquam aspernatur exercitationem. Quae, quis.',
        averageData: '70-140',
        icon: <GiHealthPotion className="text-red-500 text-2xl" />
    },
]


const AdvicesMedications = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return(
        <Box
            className={`rounded-lg md:overflow-x-scroll lg:w-[60%] md:w-1/2 w-full overflow-x-auto p-4`} 
            sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                display: 'flex',
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'left',
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500],
                    }}
                >
                    Conseils médicals
                </Typography>
                <Typography
                    variant="p"
                    sx={{
                        textAlign: 'left',
                        marginBottom: '12px',
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600],
                    }}
                >
                    Des conseils pour avoir un bon mode de vie.
                </Typography>
            </Box>
            {/* Cas où le patients n'a pas fait des test de ses données santé */}
            {/* <Typography
                variant="h6"
                className="py-10"
                sx={{
                    fontWeight: 500,
                    color: colors.blackAccent[100]
                }}
            >
                Bientôt disponible ! Nous nous excusons de cette rupture.
            </Typography> */}
            <Box className="rounded-lg flex flex-col gap-3 w-full">
                {advicesMedications.map((advicesMedication, index) => (
                    <Box 
                        key={index}
                        className="flex flex-col w-full gap-2 justify-start rounded-lg p-3 duration-300"
                    >
                        <Box className="flex flex-row gap-2">
                            {advicesMedication.icon}
                            <Typography
                                variant="h4"
                                className="flex flex-col font-semibold text-left gap-0"
                                fontWeight={600}
                            >
                                {advicesMedication.name}
                            </Typography>
                        </Box>
                        <Typography 
                            variant="p"
                            sx={{ 
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600],
                                textAlign: 'left',
                            }}
                        >
                            {advicesMedication.description}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default AdvicesMedications;