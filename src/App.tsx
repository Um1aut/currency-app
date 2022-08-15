import React, { useState } from 'react';
import Graph from './components/graph';

import { Font } from './components/fonts';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, PaletteMode, Fade, useScrollTrigger, Divider, ScopedCssBaseline, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, makeStyles, TextField } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { amber, blue, blueGrey, deepOrange, grey, purple } from '@mui/material/colors';
import {ToggleColorMode} from './components/changemode'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import Spline from '@splinetool/react-spline';
import { json } from 'stream/consumers';
import { light } from '@mui/material/styles/createPalette';

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"JetBrains Mono"',
      '"Apple Color Emoji"',
    ].join(','),
  }
});


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
const getDesignTokens = (mode: PaletteMode) => ({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"JetBrains Mono"',
      '"Apple Color Emoji"',
    ].join(','),
  },
  palette: {
    mode,
    primary: {
      ...amber,
      ...(mode === 'dark' && {
        main: "#0e1129",
      }),
    },
    ...(mode === 'dark' && {
      background: {
        default: "#0e1129",
        paper: "#0e1129",
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
            primary: grey[900],
            secondary: grey[800],
            
          }
        : {
            primary: '#fff',
            secondary: grey[500],
          }),
    },
  },
});
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Daily statistics',
    },
  },
};

let labels = [...new Array(20)].map((i, idx) => moment().startOf("day").subtract(idx, "days").format("DD.MM"));
labels = labels.reverse()



export function App() {

  const darkModeTheme = createTheme(getDesignTokens('dark'));
  const theme = useTheme();

  const [currency1, setCurrency1] = React.useState('');
  const [currency2, setCurrency2] = React.useState('');

  const [amount, setAmount] = React.useState('')

  const handleChange1 = (event: SelectChangeEvent) => {
    setCurrency1(event.target.value);
  };

  const [result1, setResult] = useState('')

  const countHandler = () => {
    console.log(currency1)
    console.log(currency2)

    console.log(amount)

    var myHeaders = new Headers();
    myHeaders.append("apikey", "30vMXXkzI0jxBq7XV916dI961Pqs5KWy");
    
    var requestOptions:RequestInit = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    const ApiRequestLink = "https://api.apilayer.com/exchangerates_data/convert?to="+currency2+"&from="+currency1+"&amount="+amount
    fetch(ApiRequestLink, requestOptions)
    .then(response => response.text())
    .then(success => {
      const obj = JSON.parse(success)
      setResult(obj.result + " "+currency2)
    })
    .catch(error => console.log('error', error));
  }
  const handleChange2 = (event: SelectChangeEvent) => {
    setCurrency2(event.target.value);
  };

  const [currentTheme, setTheme] = useState('dark')

  const toggleColorMode = () => {
    if(currentTheme == "dark") {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  const lightTheme = createTheme(getDesignTokens('light'));
  theme.transitions.create(['background-color', 'transform']);

  const data = {
    labels,
    datasets: [
      {
        label: 'USD to EUR',
        data: labels.map(() => Math.random()),
        borderColor: currentTheme == "dark" ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255, 255, 255)',
      }
    ],
  };
  return (
    <Box
    fontFamily={"JetBrains Mono"}>
    <ThemeProvider theme={currentTheme == "dark" ? darkModeTheme : lightTheme}>
      <CssBaseline />
      <AppBar color="transparent" sx={{backdropFilter:"blur(20px)"}} component="nav">
        <Toolbar
        sx={{justifyContent: "center"}}
        variant='dense'>
          <Box
          sx={{mr:100,
            display: { xs: 'none', md: 'flex' }}}
          >
          <Typography
            variant="h6"
            noWrap
            component="div"
            fontFamily={"JetBrains Mono"}
          >
            Currency App.
          </Typography>
          
          <Box
            >
              
            </Box>
          </Box>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Search sx={{ display: { xs: 'none', md: 'flex' } }} >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

        </Toolbar>
      </AppBar>
          
        <Box
          height="1000px"
          width="100%"
        >
          <Box
            position={"absolute"}
            margin="0"
            top="0"
            left="0"
            width="100%"
            height="100%"
          >
            <Spline scene="https://prod.spline.design/DgkYemJz8YZ31YSP/scene.splinecode" />
          </Box>
        </Box>
      <Box     
        position={"absolute"}
        margin="0"
        top="0"
        right="0" 
        borderRadius={8}
        sx={{
          width: "auto",
          height: "auto",
          mt:20,
          mr:10,
          pl:3,
          pt:2,
          pb:2,
          pr:3,
          backdropFilter:"blur(20px)",
          zIndex: 1
          }}>
        <Typography
        variant="h2"
        fontFamily={"JetBrains Mono"}
        >
          <div>Your Currency.</div>
          <br></br>
          <Typography 
          fontFamily={"JetBrains Mono"} variant="h3">Bequeme Quelle</Typography>
        </Typography>
        <Typography 
          fontFamily={"JetBrains Mono"} variant="h3">
          für Wechselkurse.</Typography>
        <Fade in={true}>
        <Box
        mt="5"
        borderRadius={6}
        margin="auto"
        width="auto"
        height="300px"
        sx={{backgroundColor: "rgba(0,0,0,0.7)"}}>
          <Box sx={{width: "53%", display: "flex", margin: "auto", mt:1, pt:2}}>
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
              <InputLabel id="demo-select-small" sx={{color:"white"}}>CUR</InputLabel>
              <Select
              variant="outlined"
              sx={{
                border: "1px solid darkgrey",
                color: "#fff",
              "& .MuiSvgIcon-root": {
                  color: "white",
              },}}
                labelId="demo-select-small"
                id="demo-select-small"
                value={currency1}
                label="USD"
                onChange={handleChange1}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"EUR"}>EUR</MenuItem>
                <MenuItem value={"UAH"}>UAH</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={countHandler} sx={{display:"flex", justifyContent:"center", alignItems:"center", color: "white"}}><CurrencyExchangeIcon/></Button>
            <FormControl sx={{ m: 1, minWidth: 80, ml:2 }} size="small">
              <InputLabel id="demo-select-small" sx={{color:"white"}}>CUR</InputLabel>
              <Select
              variant="outlined"
              sx={{
                border: "1px solid darkgrey",
                color: "#fff",
              "& .MuiSvgIcon-root": {
                  color: "white",
              },}}
                labelId="demo-select-small"
                id="demo-select-small"
                value={currency2}
                label="USD"
                onChange={handleChange2}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"EUR"}>EUR</MenuItem>
                <MenuItem value={"UAH"}>UAH</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <ThemeProvider theme={darkModeTheme}>
          <Box marginTop={5}>
            <TextField
            id="outlined-number"
            label="Amount"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            onChange={e => {setAmount(e.target.value)}}
            sx={{width: "40%", display: "flex", margin: "auto ",
            color:"white"
            }}/>
          </Box>
          <Box sx={{display: "flex", justifyContent: "center", alignItems:"center", mt:6}}>
            <Typography variant='h4' sx={{display: "flex", textAlign: "center", color: "white"}}>
              {result1}
            </Typography>
          </Box>
          </ThemeProvider>
        </Box>
        </Fade>
      </Box>
      <Divider><Button>USD</Button> to EUR</Divider>
      <Box 
      sx={{alignItems:"center", margin: "auto", width: "70%"}}>
        <Typography 
            fontFamily={"JetBrains Mono"}textAlign={"center"} variant="h4">Statistics</Typography>
        <Line options={options} data={data} />
      </Box>
      </ThemeProvider>
    </Box>
  )
}

export default App;