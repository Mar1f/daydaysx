import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = 'mar1';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'codeNav',
          title: '编程',
          href: '#',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: '编程',
          href: '#',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> 源码
            </>
          ),
          href: '#',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
