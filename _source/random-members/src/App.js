import React from 'react';
import useLocalStorage from 'react-use-localstorage';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import 'fonts.css/dist/fonts.css';
import 'roboto-fontface';
import '@material-ui/icons';
import './App.css';

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  main: {
    height: 'auto',
    margin: 0,
    flexGrow: 1,
  }
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function splitMemberList(value) {
  const members = [];
  const hashMap = {};
  for (const s of value.split('\n').filter(s => s.trim())) {
    if (!hashMap[s]) {
      hashMap[s] = 1;
      members.push(s);
    }
  }
  return members;
}

export default function App() {
  const classes = useStyles();
  // selected tab
  const [selectedTab, setSelectedTab] = React.useState(0);
  // member list
  const [storedMemberList, setStoredMemberList] = useLocalStorage('memberList', '');
  const [memberList, setMemberList] = React.useState(splitMemberList(storedMemberList));
  // result list
  const [resultList, setResultList] = useLocalStorage('resultList', '');
  // generate random count
  const [generateCount, setGenerateCount] = useLocalStorage('generateCount', '0');

  function safeSetGenerateCount(value) {
    value = Number(value);
    if (value < 0) {
      setGenerateCount(0);
    } else if (value > memberList.length) {
      setGenerateCount(memberList.length);
    }
  }

  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleMemberListChange = (event) => {
    const members = splitMemberList(event.target.value);
    setMemberList(members);
    setStoredMemberList(members.join('\n'));
    safeSetGenerateCount(generateCount);
  };

  const handleGenerateCountInputChange = event => {
    setGenerateCount(event.target.value === '' ? '0' : Number(event.target.value));
  };

  const handleGenerateCountInputBlur = (value) => {
    safeSetGenerateCount(value);
  };

  const handleGenerate = (event) => {
    safeSetGenerateCount(generateCount);
    const sampledMembers = getRandomSubarray(memberList, Number(generateCount));
    setResultList(sampledMembers.join('\n'));
    setSelectedTab(1);
  };

  return (
    <div className={classes.wrapper}>
      <AppBar position="static">
        <CssBaseline />
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            随机名单生成器
          </Typography>
          <Button color="inherit" onClick={handleGenerate}>生成随机名单</Button>
        </Toolbar>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="输入名单" {...a11yProps(0)} />
          <Tab label="随机结果" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <div className={classes.main}>
        <TabPanel value={selectedTab} index={0}>
          <form noValidate autoComplete="off">
            <div>
              <FormControl fullWidth>
                <InputLabel htmlFor="generate-count-input">随机名单长度</InputLabel>
                <Input
                  id="generate-count-input"
                  value={Number(generateCount)}
                  label='随机名单长度'
                  onChange={handleGenerateCountInputChange}
                  onBlur={handleGenerateCountInputBlur}
                  variant='outlined'
                  fullWidth
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: memberList.length,
                    type: 'number',
                  }}
                />
              </FormControl>
            </div>
            <div style={{marginTop: '20px'}}>
              <FormControl fullWidth>
                <TextField
                  id="memberList"
                  label={`请输入名单（现有 ${memberList.length} 项）`}
                  multiline
                  fullWidth
                  variant="outlined"
                  defaultValue={memberList.join('\n')}
                  onChange={handleMemberListChange} 
                />
              </FormControl>
            </div>
          </form>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <form noValidate autoComplete="off">
            <div>
              <FormControl fullWidth>
                <InputLabel htmlFor="generate-count-input">随机名单长度</InputLabel>
                <Input
                  id="generate-count-input"
                  value={Number(generateCount)}
                  label='随机名单长度'
                  onChange={handleGenerateCountInputChange}
                  onBlur={handleGenerateCountInputBlur}
                  variant='outlined'
                  fullWidth
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: memberList.length,
                    type: 'number',
                  }}
                />
              </FormControl>
            </div>
            <div style={{marginTop: '20px'}}>
              <TextField
                id="resultList"
                label="随机结果"
                multiline
                fullWidth
                readOnly
                variant="outlined"
                value={resultList}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </form>
        </TabPanel>
      </div>
    </div>
  );
}
