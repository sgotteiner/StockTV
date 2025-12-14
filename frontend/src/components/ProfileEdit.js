import React from 'react';
import '../App.css';

/**
 * ProfileEdit Component
 * Form for editing user profile information
 */
const ProfileEdit = ({
    editForm,
    setEditForm,
    onSave,
    onCancel,
    isLoading
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="profile-actions" style={{ marginTop: '4vh' }}>
                        <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="action-button"
                            style={{ marginTop: '0', border: 'none', background: 'transparent' }}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
