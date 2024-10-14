import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './header.module.css';
import { Link } from '@remix-run/react';
import { ToggleMode } from '../toggle-theme/toggle-mode';


export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box pb={5}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* <MantineLogo size={30} /> */}
          <Text>Remix Blog App</Text>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link to="#" className={classes.link}>
              Home
            </Link>
            <Link to="#" className={classes.link}>
              Learn
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
            <ToggleMode />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link to="#" className={classes.link}>
            Home
          </Link>
          <Link to="#" className={classes.link}>
            Learn
          </Link>
          <Link to="#" className={classes.link}>
            Academy
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}