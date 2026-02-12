import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
}

const mainListItems: MenuItem[] = [
  { text: 'Home', icon: <HomeRoundedIcon /> },
  { text: 'Analytics', icon: <AnalyticsRoundedIcon /> },
  { text: 'Clients', icon: <PeopleRoundedIcon /> },
  { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
];

// Liquid Glass inspired sidebar container
const GlassSidebar = styled(Box)({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  borderRight: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  height: '100vh',
  width: 280,
  position: 'sticky', // Sticky instead of fixed
  top: 0,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden', // Prevent sidebar scrolling
});

// Apple-style list item button
const StyledListItemButton = styled(ListItemButton)({
  borderRadius: 12,
  margin: '4px 8px',
  padding: '10px 16px',
  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.02)',
  },
  
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    color: '#007AFF',
    
    '&:hover': {
      backgroundColor: 'rgba(0, 122, 255, 0.16)',
    },
    
    '& .MuiListItemIcon-root': {
      color: '#007AFF',
    },
  },
});

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 40,
  color: 'rgba(0, 0, 0, 0.6)',
  transition: 'color 0.2s ease',
});

const StyledListItemText = styled(ListItemText)({
  '& .MuiTypography-root': {
    fontWeight: 500,
    fontSize: '15px',
    letterSpacing: '-0.01em',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  },
});

export default function MenuContent(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const handleListItemClick = (index: number): void => {
    setSelectedIndex(index);
  };

  return (
    <GlassSidebar>
      <Stack sx={{ height: '100%', p: 2, justifyContent: 'flex-start' }}>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              px: 2,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            Name of the app
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {mainListItems.map((item: MenuItem, index: number) => (
            <ListItem key={index} disablePadding>
              <StyledListItemButton
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index)}
              >
                <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                <StyledListItemText primary={item.text} />
              </StyledListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
    </GlassSidebar>
  );
}
