import { useState, useEffect } from 'react';
import { getPurchaseHistory } from '../../api/users';
import '../../styles.css';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getPurchaseHistory();
        setHistory(response.data);
      } catch (err) {
        setError('Failed to load purchase history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;

  return (
    <div className="container purchase-history-container mt-5">
      <h1 className="title has-text-centered mb-4">Purchase History</h1>

      {history.length === 0 ? (
        <div className="notification is-info has-text-centered">
          You haven't made any purchases yet.
        </div>
      ) : (
        <div className="card purchase-history-card">
          <header className="card-header">
            <p className="card-header-title">Your Transactions</p>
          </header>
          <div className="card-content">
            <div className="table-wrapper">
              <table className="table purchase-history-table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th className="has-text-right">Original Price</th>
                    <th className="has-text-centered">Discount</th>
                    <th className="has-text-right">Final Price</th>
                    <th className="has-text-centered">Payment Method</th>
                    <th className="has-text-centered">Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.Game.nama}</td>
                      <td className="has-text-right">${transaction.harga_awal.toFixed(2)}</td>
                      <td className="has-text-centered">{transaction.discount}%</td>
                      <td className="has-text-right">${transaction.harga_discount.toFixed(2)}</td>
                      <td className="has-text-centered">{transaction.metode_pembayaran || 'N/A'}</td>
                      <td className="has-text-centered">
                        {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
