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
  Avatar,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './header.module.css';
import { Link, useFetcher } from '@remix-run/react';
import { ToggleMode } from '../toggle-theme/toggle-mode';

type HeaderProps = {
  user?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  }
}

export function Header({ user }: HeaderProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const fetcher = useFetcher();
  return (
    <Box pb={5}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* <MantineLogo size={30} /> */}
          <Text component='a' href='/'>Remix Blog App</Text>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link to="/" className={classes.link}>
              Home
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <ToggleMode />
            {user?.id ? (
              <>
                <Avatar color='green' name={user.first_name?.charAt(0)} />
                <Link to={'/create'}>
                  <Button variant="outline" color='orange'>Create Post</Button>
                </Link>
                <fetcher.Form method='post' action='/logout'>
                  <Button type='submit' variant="filled" color='red'>Log out</Button>
                </fetcher.Form>
              </>
            ) : (
              <>
                <Button variant="default" component='a' href='/login'>Log in</Button>
                <Button variant='outline' component='a' href='/signup'>Sign up</Button>
              </>
            )}
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
          <Link to="/" className={classes.link}>
            Home
          </Link>
          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {user?.id ? (
              <>
                <Button variant="filled" color='red' component='a' href='/logout'>Log out</Button>
              </>
            ) : (
              <>
                <Button variant="default" component='a' href='/login'>Log in</Button>
                <Button variant='outline' component='a' href='/signup'>Sign up</Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}