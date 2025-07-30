import PostCard from "./PostCard";

function Dashboard({ email, posts, topics, loading }) {
  return (
    <div className="view">
      <h1 className="header">My Dashboard</h1>
      <p className="description">{email}</p>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul style={{ paddingInlineStart: '0px' }}>
          {posts.map(post => (
            <li key={post.link} style={{ listStyle: 'none' }}>
              <PostCard post={post} topics={topics} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;