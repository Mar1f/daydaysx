import { Button, Card, Layout, Typography, Row, Col } from 'antd';
import { ShoppingCartOutlined, StarOutlined, TruckOutlined, SendOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function WelcomePage() {
  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center px-4 lg:px-6">
        <Link className="flex items-center" href="#">
          <ShoppingCartOutlined style={{ fontSize: '24px' }} />
          <span className="sr-only">Store</span>
        </Link>
        <nav className="ml-auto flex gap-4">
          <Link href="#" className="text-sm font-medium hover:underline">商品</Link>
          <Link href="#" className="text-sm font-medium hover:underline">关于我们</Link>
          <Link href="#" className="text-sm font-medium hover:underline">联系我们</Link>
        </nav>
      </Header>
      <Content className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <Title level={1} className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                欢迎来到商城
              </Title>
              <Paragraph className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                发现精选商品，享受优质购物体验。我们提供最新潮流和最优惠的价格。
              </Paragraph>
              <div className="space-x-4">
                <Button type="primary" href="#">立即购物</Button>
                <Button type="default" href="#">了解更多</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <Title level={2} className="text-3xl font-bold text-center mb-8">特色商品</Title>
            <Row gutter={16}>
              {[
                { name: "时尚T恤", price: "¥99", image: "/placeholder.svg?height=200&width=200" },
                { name: "智能手表", price: "¥999", image: "/placeholder.svg?height=200&width=200" },
                { name: "无线耳机", price: "¥599", image: "/placeholder.svg?height=200&width=200" },
              ].map((product) => (
                <Col span={8} key={product.name}>
                  <Card cover={<Image src={product.image} alt={product.name} width={200} height={200} className="rounded-lg object-cover" />}>
                    <Card.Meta title={product.name} description={product.price} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Title level={2} className="text-3xl font-bold text-center mb-8">为什么选择我们</Title>
            <Row gutter={16}>
              {[
                { icon: <StarOutlined />, title: "优质商品", description: "精选高品质商品，确保您的满意" },
                { icon: <TruckOutlined />, title: "快速配送", description: "高效的物流系统，让您尽快收到商品" },
                { icon: <SendOutlined />, title: "优惠价格", description: "定期促销活动，为您提供最优惠的价格" },
              ].map((feature) => (
                <Col span={8} key={feature.title}>
                  <Card>
                    <Card.Meta avatar={feature.icon} title={feature.title} description={feature.description} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      </Content>
      <Footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024商城. 保留所有权利.</p>
        <nav className="sm:ml-auto flex gap-4">
          <Link className="text-xs hover:underline" href="#">条款</Link>
          <Link className="text-xs hover:underline" href="#">隐私政策</Link>
        </nav>
      </Footer>
    </Layout>
  );
}
