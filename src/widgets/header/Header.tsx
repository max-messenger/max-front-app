import { Avatar, Typography } from '@maxhub/max-ui'

import { ThemeToggleButton } from '@/features/toggle-theme'
import { useUserFromBridge } from '@/shared/bridge'
import { classNames } from '@/shared/lib/class-names.ts'
import { FlexBox } from '@/shared/ui/FlexBox'

import styles from './Header.module.scss'

interface HeaderProps {
  sticky?: boolean
}

export const Header = ({ sticky = true }: HeaderProps) => {
  const { userName, userInitials, userAvatar } = useUserFromBridge()

  return (
    <div className={classNames(styles.container, { [styles.sticky]: sticky })}>
      <header className={styles.header}>
        <FlexBox alignItems="center" justifyContent="space-between" gap={12}>
          <FlexBox alignItems="center" gap={10}>
            <Avatar.Container size={44} form="circle">
              {userAvatar
                ? (
                  <Avatar.Image src={userAvatar} alt={userName} />
                )
                : (
                  <Avatar.Text>{userInitials}</Avatar.Text>
                )}
            </Avatar.Container>
            <FlexBox direction="column" gap={2}>
              <Typography.Label>С возвращением!</Typography.Label>
              <Typography.Title>{userName}</Typography.Title>
            </FlexBox>
          </FlexBox>
          <ThemeToggleButton />
        </FlexBox>
      </header>
    </div>
  )
}
